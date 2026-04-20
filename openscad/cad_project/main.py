"""
CadQuery 項目主入口 — 在 cq-editor 中直接打開此文件。
"""

import sys
from pathlib import Path

# ── 確保項目根目錄在 sys.path 中，使 src 包可導入 ──────────
_PROJECT_ROOT = Path(__file__).resolve().parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

import cadquery as cq

from src.parts.instrument import make_instrument

# =====================================================================
#  智能秤儀表模型
# =====================================================================

instrument = make_instrument()
show_object(instrument, name="instrument")

# ── 導出提示 ─────────────────────────────────────────────────
# 在 cq-editor Python console 中執行以下命令導出：
#
#   import os
#   os.makedirs("export", exist_ok=True)
#   instrument.save("export/instrument.step")      # SolidWorks 可打開
#   instrument.save("export/instrument.glb")       # 3D web/Blender
#
# 若要將 app 截圖作為屏幕 texture：
#   1. 將 app 截圖保存為 textures/screen_app.png
#   2. 執行: python tools/apply_screen_texture.py
