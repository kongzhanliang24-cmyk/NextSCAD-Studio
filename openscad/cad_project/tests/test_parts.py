"""
零件單元測試：驗證零件可成功構建、邊界框尺寸合理。
使用 pytest 運行：pytest tests/
"""

import sys
from pathlib import Path

# 確保項目根目錄在 sys.path 中
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

import cadquery as cq

from src.parts.example_part import make_bracket
from src.assemblies.example_assembly import make_base_plate


class TestBracket:
    """測試 L 形安裝支架。"""

    def test_build_default(self):
        """默認參數應能成功構建。"""
        result = make_bracket()
        assert result is not None
        assert isinstance(result, cq.Workplane)

    def test_is_solid(self):
        """結果應包含至少一個實體。"""
        result = make_bracket()
        solids = result.val().Solids() if hasattr(result.val(), "Solids") else [result.val()]
        assert len(solids) >= 1

    def test_bounding_box(self):
        """邊界框應與輸入尺寸大致匹配。"""
        w, h, d = 40.0, 50.0, 30.0
        result = make_bracket(width=w, height=h, depth=d)
        bb = result.val().BoundingBox()

        assert abs(bb.xlen - w) < 1.0, f"寬度偏差過大: {bb.xlen} vs {w}"
        assert abs(bb.ylen - d) < 1.0, f"深度偏差過大: {bb.ylen} vs {d}"
        assert abs(bb.zlen - h) < 1.0, f"高度偏差過大: {bb.zlen} vs {h}"

    def test_custom_params(self):
        """自定義參數應能成功構建。"""
        result = make_bracket(width=60, height=80, depth=40, thickness=8, bolt_size="M6")
        assert result is not None

    def test_volume_positive(self):
        """體積應為正值。"""
        result = make_bracket()
        vol = result.val().Volume()
        assert vol > 0, f"體積應為正值，實際: {vol}"


class TestBasePlate:
    """測試底板。"""

    def test_build_default(self):
        """默認參數應能成功構建。"""
        result = make_base_plate()
        assert result is not None

    def test_bounding_box(self):
        """底板尺寸應匹配。"""
        result = make_base_plate(length=120, width=60, thickness=4)
        bb = result.val().BoundingBox()
        assert abs(bb.zlen - 4.0) < 0.5
