"""
示例零件：參數化安裝支架。
帶有安裝孔和減重槽的 L 形支架。
"""

import cadquery as cq

from src.config import BOLT_HOLE, COUNTERBORE


def make_bracket(
    width: float = 40.0,
    height: float = 50.0,
    depth: float = 30.0,
    thickness: float = 5.0,
    fillet_r: float = 2.0,
    bolt_size: str = "M5",
) -> cq.Workplane:
    """
    創建 L 形安裝支架。

    Parameters
    ----------
    width : 支架寬度 (X)
    height : 支架高度 (Z)
    depth : 支架深度 (Y)
    thickness : 壁厚
    fillet_r : 內外圓角半徑
    bolt_size : 螺栓規格，用於安裝孔

    Returns
    -------
    cq.Workplane
    """
    hole_dia = BOLT_HOLE.get(bolt_size, 5.5)
    cb = COUNTERBORE.get(bolt_size, {"dia": 9.5, "depth": 5.0})

    # ── 基礎 L 形 ─────────────────────────────────────────
    result = (
        cq.Workplane("XY")
        # 底板
        .box(width, depth, thickness, centered=(True, False, False))
        # 豎板
        .faces(">Z")
        .workplane()
        .transformed(offset=(0, -depth / 2 + thickness / 2, 0))
        .box(width, thickness, height - thickness, centered=(True, True, False))
    )

    # ── 底板安裝孔（2 個沉頭孔）──────────────────────────
    hole_spacing = width * 0.6
    result = (
        result
        .faces("<Z")
        .workplane()
        .pushPoints([(-hole_spacing / 2, depth / 2), (hole_spacing / 2, depth / 2)])
        .cboreHole(hole_dia, cb["dia"], cb["depth"])
    )

    # ── 豎板安裝孔（2 個通孔）────────────────────────────
    vhole_z_offset = (height - thickness) * 0.5
    result = (
        result
        .faces("<Y")
        .workplane()
        .pushPoints([(-hole_spacing / 2, vhole_z_offset), (hole_spacing / 2, vhole_z_offset)])
        .hole(hole_dia)
    )

    # ── 圓角 ──────────────────────────────────────────────
    result = result.edges("|Z").fillet(fillet_r)

    return result
