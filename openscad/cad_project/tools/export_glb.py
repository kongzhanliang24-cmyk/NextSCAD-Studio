"""
導出智能秤儀表 GLB 檔案。

用法:
    python tools/export_glb.py
    # 或指定輸出檔名:
    python tools/export_glb.py my_name.glb

預設輸出: export/terminal_base.glb
"""

import sys
from pathlib import Path

# 把專案根與 tools/ 加入 sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
TOOLS_DIR = Path(__file__).resolve().parent
for _p in (PROJECT_ROOT, TOOLS_DIR):
    if str(_p) not in sys.path:
        sys.path.insert(0, str(_p))

from src.parts.instrument import make_instrument


def main() -> None:
    # 決定輸出檔名
    if len(sys.argv) > 1:
        out_name = sys.argv[1]
    else:
        out_name = "terminal_base.glb"
    if not out_name.lower().endswith(".glb"):
        out_name += ".glb"

    out_dir = PROJECT_ROOT.parent.parent / "weighting_new" / "public" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / out_name

    print("[BUILD] 正在構建 instrument assembly ...")
    assy = make_instrument()

    print(f"[EXPORT] 寫入 GLB -> {out_path}")
    # CadQuery 2.7+ 正確 API：Assembly.export(path, exportType='GLTF')
    # GLTF 匯出器同時支援 .glb（binary）與 .gltf（JSON）
    assy.export(str(out_path), exportType="GLTF")
    if not out_path.exists():
        print(f"[ERROR] 輸出失敗，檔案未生成: {out_path}")
        return
    size_kb = out_path.stat().st_size / 1024
    print(f"[DONE] 基礎幾何輸出 ({size_kb:.1f} KB): {out_path}")

    # ── 自動套 texture（若 textures/screen_app.png 存在）──
    texture_path = PROJECT_ROOT / "textures" / "screen_app.png"
    if not texture_path.exists():
        print()
        print("─" * 60)
        print(f"[提示] 未找到屏幕貼圖 {texture_path}")
        print("       當前輸出的 GLB 屏幕為純白（無 app 畫面）。")
        print("       若要貼 app 畫面：")
        print("         1. 將 app 截圖存為 textures/screen_app.png")
        print("         2. 重新執行: python tools/export_glb.py")
        print("─" * 60)
        return

    # 有貼圖 → 套到屏幕 mesh 上，覆蓋原 GLB
    print(f"\n[TEXTURE] 偵測到 {texture_path.name}，自動套用到屏幕...")
    from apply_screen_texture import apply_texture_to_glb

    tmp_textured = out_path.with_name(out_path.stem + "_textured.glb")
    rc = apply_texture_to_glb(out_path, tmp_textured, texture_path)
    if rc != 0:
        print("[WARN] Texture 步驟失敗，保留純幾何 GLB。")
        return

    # 以貼圖版取代原檔（user 只要拿 terminal_base.glb 就好）
    import shutil
    shutil.move(str(tmp_textured), str(out_path))
    final_kb = out_path.stat().st_size / 1024
    print(f"[DONE] 已覆蓋為帶 texture 版本 ({final_kb:.1f} KB): {out_path}")


if __name__ == "__main__":
    main()
