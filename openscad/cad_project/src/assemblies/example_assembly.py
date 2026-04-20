"""
示例裝配體：將兩個支架對稱安裝到一塊底板上。
演示 cq.Assembly 的基本用法。
"""

import cadquery as cq

from src.parts.example_part import make_bracket


def make_base_plate(
    length: float = 120.0,
    width: float = 60.0,
    thickness: float = 4.0,
) -> cq.Workplane:
    """創建簡易底板。"""
    return (
        cq.Workplane("XY")
        .box(length, width, thickness)
        .edges("|Z")
        .fillet(3.0)
    )


def make_bracket_assembly(
    bracket_spacing: float = 80.0,
) -> cq.Assembly:
    """
    創建裝配體：底板 + 兩個對稱放置的 L 形支架。

    Parameters
    ----------
    bracket_spacing : 兩個支架中心之間的距離 (X 方向)

    Returns
    -------
    cq.Assembly
    """
    plate = make_base_plate()
    bracket_left = make_bracket()
    bracket_right = make_bracket()

    assy = cq.Assembly(name="bracket_assembly")

    # 底板 — 放在原點
    assy.add(
        plate,
        name="base_plate",
        color=cq.Color("gray50"),
    )

    # 左支架
    assy.add(
        bracket_left,
        name="bracket_left",
        loc=cq.Location((-bracket_spacing / 2, 0, 2)),
        color=cq.Color("steelblue"),
    )

    # 右支架
    assy.add(
        bracket_right,
        name="bracket_right",
        loc=cq.Location((bracket_spacing / 2, 0, 2)),
        color=cq.Color("tomato"),
    )

    return assy
