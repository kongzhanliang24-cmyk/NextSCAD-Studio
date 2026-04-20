"""
將 P-IMS app 截圖貼到 GLB 模型中的屏幕 mesh 上，輸出帶 texture 的新 GLB。

流程：
  1. 讀取 CadQuery 導出的 export/instrument.glb（僅含幾何 + 純色）
  2. 根據屏幕標記色（純白 1.0,1.0,1.0）找到屏幕 mesh
  3. 為屏幕 mesh 產生 UV 座標（平面投影）
  4. 載入 textures/screen_app.png 作為 baseColorTexture
  5. 輸出 export/instrument_textured.glb

用法：
  python tools/apply_screen_texture.py

依賴：
  pip install trimesh pillow numpy
"""

import sys
from pathlib import Path

import numpy as np
import trimesh
from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parent.parent
# 預設值（可被 CLI 或 apply_texture_to_glb() 參數覆蓋）
DEFAULT_SRC = PROJECT_ROOT / "export" / "terminal_base.glb"
DEFAULT_DST = PROJECT_ROOT / "export" / "terminal_base_textured.glb"
DEFAULT_TEXTURE = PROJECT_ROOT / "textures" / "screen_app.png"

# 屏幕標記色（CadQuery assembly 中屏幕使用純白色）
SCREEN_MARKER_COLOR = np.array([255, 255, 255, 255], dtype=np.uint8)
COLOR_TOLERANCE = 5  # RGB 分量容差


def find_screen_mesh(scene: trimesh.Scene) -> tuple[str, trimesh.Trimesh]:
    """
    找出屏幕 mesh。策略（依優先順序）：
      1. 名稱含 'screen' 的 geometry（最可靠）
      2. 形狀像大薄板的 geometry（bbox 一維極薄、另兩維大於 80mm）
    單純用顏色匹配不可靠：trimesh 對未指定顏色的 mesh 預設 face_colors 為白色。
    """
    # 1) 名稱含 'screen' 的所有片（CadQuery 會把 box 拆成 6 面）
    #    → 挑 Y 薄軸（法向沿 Y）且 Y 最小的那片 = 前面
    screen_meshes = [
        (n, g) for n, g in scene.geometry.items()
        if isinstance(g, trimesh.Trimesh) and "screen" in n.lower()
    ]
    front_faces = []
    for name, g in screen_meshes:
        size = g.bounds[1] - g.bounds[0]
        if size[1] < 0.1:
            front_faces.append((name, g, float(g.bounds[0][1])))
    if front_faces:
        front_faces.sort(key=lambda x: x[2])
        name, g, y = front_faces[0]
        print(f"       找到屏幕前面: '{name}' (Y={y:.2f}, {len(g.vertices)} 頂點)")
        return name, g

    # 2) 形狀匹配 fallback
    best = None
    best_area = 0.0
    for name, geom in scene.geometry.items():
        if not isinstance(geom, trimesh.Trimesh):
            continue
        size = geom.bounds[1] - geom.bounds[0]
        sorted_dims = np.sort(size)
        # 薄板：最薄 < 3mm、次薄 > 80mm、最大 > 100mm
        if sorted_dims[0] < 3.0 and sorted_dims[1] > 80.0 and sorted_dims[2] > 100.0:
            area = sorted_dims[1] * sorted_dims[2]
            if area > best_area:
                best_area = area
                best = (name, geom)

    if best is not None:
        print(
            f"       以尺寸匹配找到屏幕: '{best[0]}' "
            f"(面積 {best_area:.0f} mm²)"
        )
        return best

    return None, None


def generate_planar_uv(mesh: trimesh.Trimesh) -> np.ndarray:
    """
    為平面屏幕 mesh 生成 UV 座標。

    策略：屏幕是「薄板」，bounding box 三個維度中最薄的軸即為法向軸。
    這比對所有面法向平均穩定（box mesh 的面法向兩兩相消，平均會是 0 向量）。
    將頂點投影到另外兩個軸構成的平面，正規化到 [0, 1]。
    """
    verts = mesh.vertices
    bbox_min = verts.min(axis=0)
    bbox_max = verts.max(axis=0)
    bbox_size = bbox_max - bbox_min

    # 最薄維度 = 法向軸
    normal_axis = int(np.argmin(bbox_size))
    uv_axes = [i for i in range(3) if i != normal_axis]

    print(
        f"       bbox 尺寸 X/Y/Z = "
        f"{bbox_size[0]:.2f} / {bbox_size[1]:.2f} / {bbox_size[2]:.2f} mm "
        f"→ 法向軸 = {'XYZ'[normal_axis]}，UV 軸 = {'XYZ'[uv_axes[0]]}{'XYZ'[uv_axes[1]]}"
    )

    uv = verts[:, uv_axes].astype(np.float64)
    uv_range = bbox_size[uv_axes]
    uv_range[uv_range == 0] = 1.0
    uv = (uv - bbox_min[uv_axes]) / uv_range

    # 若第一個 UV 軸是 X 且第二個是 Z（常見於屏幕朝 -Y 的情況），
    # 需要把 V 對應到 Z 的反向，因為 Z 向上、V 在圖片中向下
    uv[:, 0] = 1.0 - uv[:, 0]
    uv[:, 1] = 1.0 - uv[:, 1]

    return uv.astype(np.float32)


def apply_texture(mesh: trimesh.Trimesh, texture_path: Path) -> trimesh.Trimesh:
    """為 mesh 套用 texture。"""
    img = Image.open(texture_path).convert("RGBA").rotate(180)
    uv = generate_planar_uv(mesh)

    material = trimesh.visual.material.PBRMaterial(
        name="ScreenMaterial",
        baseColorTexture=img,
        metallicFactor=0.0,
        roughnessFactor=0.8,
    )
    mesh.visual = trimesh.visual.TextureVisuals(uv=uv, material=material)
    return mesh


def apply_texture_to_glb(
    src_glb: Path,
    dst_glb: Path,
    texture_path: Path,
) -> int:
    """
    核心處理：讀 GLB、找屏幕 mesh、套 texture、寫新 GLB。
    回傳 0 表示成功，非 0 為錯誤代碼。
    """
    if not src_glb.exists():
        print(f"[錯誤] 找不到源 GLB 檔案：{src_glb}")
        return 1
    if not texture_path.exists():
        print(f"[錯誤] 找不到 texture 檔案：{texture_path}")
        print("       請將 app 截圖保存為此路徑（建議 1024×640 或更高）")
        return 1

    print(f"[1/4] 載入 GLB：{src_glb}")
    scene = trimesh.load(src_glb, force="scene")

    print(f"[2/4] 搜尋屏幕 mesh（標記色 RGB {SCREEN_MARKER_COLOR[:3].tolist()}）")
    name, screen_mesh = find_screen_mesh(scene)
    if screen_mesh is None:
        print("[錯誤] 找不到屏幕 mesh。請確認 CadQuery 中屏幕顏色為純白 (1,1,1)。")
        print("       找到的 geometry 清單：")
        for n, g in scene.geometry.items():
            print(f"        - {n}: {type(g).__name__}")
        return 1
    print(f"       找到屏幕 mesh: '{name}' ({len(screen_mesh.vertices)} 頂點)")

    print(f"[3/4] 產生 UV 並套用 texture：{texture_path}")
    apply_texture(screen_mesh, texture_path)

    print(f"[4/4] 輸出：{dst_glb}")
    dst_glb.parent.mkdir(parents=True, exist_ok=True)
    scene.export(dst_glb)

    print("\n✓ 完成！你可以用任何 GLB 檢視器打開：")
    print(f"  {dst_glb}")
    print("  推薦：https://gltf-viewer.donmccurdy.com/")
    return 0


def main(argv: list = None) -> int:
    """
    CLI：
      python tools/apply_screen_texture.py [src.glb] [dst.glb] [texture.png]
    各參數可省略，會用 DEFAULT_* 常量。
    """
    argv = argv if argv is not None else sys.argv[1:]
    src = Path(argv[0]) if len(argv) >= 1 else DEFAULT_SRC
    dst = Path(argv[1]) if len(argv) >= 2 else DEFAULT_DST
    tex = Path(argv[2]) if len(argv) >= 3 else DEFAULT_TEXTURE
    return apply_texture_to_glb(src, dst, tex)


if __name__ == "__main__":
    sys.exit(main())
