import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TOOLS_DIR = Path(__file__).resolve().parent
for _p in (PROJECT_ROOT, TOOLS_DIR):
    if str(_p) not in sys.path:
        sys.path.insert(0, str(_p))

from src.parts.accessories.usb_camera import make_usb_camera


def main() -> None:
    if len(sys.argv) > 1:
        out_name = sys.argv[1]
    else:
        out_name = "usb_camera.glb"
    if not out_name.lower().endswith(".glb"):
        out_name += ".glb"

    out_dir = PROJECT_ROOT.parent.parent / "weighting_new" / "public" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / out_name

    print("[BUILD] 正在構建 USB camera assembly ...")
    assy = make_usb_camera()

    print(f"[EXPORT] 寫入 GLB -> {out_path}")
    assy.export(str(out_path), exportType="GLTF")
    if not out_path.exists():
        print(f"[ERROR] 輸出失敗，檔案未生成: {out_path}")
        return

    size_kb = out_path.stat().st_size / 1024
    print(f"[DONE] USB 攝像頭 GLB 已輸出 ({size_kb:.1f} KB): {out_path}")


if __name__ == "__main__":
    main()
