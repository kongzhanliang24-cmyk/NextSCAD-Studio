"""
導出三色塔燈 (Tower Light) 為 GLB，供 weighting_new 前端載入。

用法:
    python tools/export_tower_light_glb.py
    # 或指定輸出檔名:
    python tools/export_tower_light_glb.py my_name.glb

預設輸出: weighting_new/public/models/tower_light.glb
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TOOLS_DIR = Path(__file__).resolve().parent
for _p in (PROJECT_ROOT, TOOLS_DIR):
    if str(_p) not in sys.path:
        sys.path.insert(0, str(_p))

from src.parts.accessories.tower_light import make_tower_light


def main() -> None:
    if len(sys.argv) > 1:
        out_name = sys.argv[1]
    else:
        out_name = "tower_light.glb"
    if not out_name.lower().endswith(".glb"):
        out_name += ".glb"

    out_dir = PROJECT_ROOT.parent.parent / "weighting_new" / "public" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / out_name

    print("[BUILD] 正在構建 tower_light assembly ...")
    assy = make_tower_light()

    print(f"[EXPORT] 寫入 GLB -> {out_path}")
    assy.export(str(out_path), exportType="GLTF")
    if not out_path.exists():
        print(f"[ERROR] 輸出失敗，檔案未生成: {out_path}")
        return

    size_kb = out_path.stat().st_size / 1024
    print(f"[DONE] 三色塔燈 GLB 已輸出 ({size_kb:.1f} KB): {out_path}")


if __name__ == "__main__":
    main()
