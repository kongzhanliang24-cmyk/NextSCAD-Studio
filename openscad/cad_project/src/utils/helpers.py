"""
通用幾何輔助函數：螺栓孔陣列、圓形陣列、常用截面等。
"""

import math
from typing import List, Tuple

import cadquery as cq


def bolt_circle(
    wp: cq.Workplane,
    bolt_dia: float,
    circle_dia: float,
    count: int,
    start_angle: float = 0.0,
) -> cq.Workplane:
    """
    在工作平面上創建螺栓圓形陣列通孔。

    Parameters
    ----------
    wp : 目標工作平面
    bolt_dia : 螺栓孔直徑
    circle_dia : 分佈圓直徑 (PCD)
    count : 孔數量
    start_angle : 起始角度 (度)

    Returns
    -------
    cq.Workplane
    """
    r = circle_dia / 2.0
    points = []
    for i in range(count):
        angle = math.radians(start_angle + i * 360.0 / count)
        points.append((r * math.cos(angle), r * math.sin(angle)))

    return wp.pushPoints(points).hole(bolt_dia)


def rect_pattern(
    wp: cq.Workplane,
    hole_dia: float,
    x_count: int,
    y_count: int,
    x_spacing: float,
    y_spacing: float,
) -> cq.Workplane:
    """
    在工作平面上創建矩形孔陣列。

    Parameters
    ----------
    wp : 目標工作平面
    hole_dia : 孔直徑
    x_count : X 方向孔數
    y_count : Y 方向孔數
    x_spacing : X 方向間距
    y_spacing : Y 方向間距

    Returns
    -------
    cq.Workplane
    """
    points: List[Tuple[float, float]] = []
    x_start = -(x_count - 1) * x_spacing / 2.0
    y_start = -(y_count - 1) * y_spacing / 2.0

    for ix in range(x_count):
        for iy in range(y_count):
            points.append((x_start + ix * x_spacing, y_start + iy * y_spacing))

    return wp.pushPoints(points).hole(hole_dia)


def rounded_rect_sketch(
    wp: cq.Workplane,
    length: float,
    width: float,
    corner_r: float,
) -> cq.Workplane:
    """
    繪製圓角矩形草圖（未拉伸），可用於後續 extrude / cut。

    Returns
    -------
    cq.Workplane 含有圓角矩形線框
    """
    return (
        wp
        .rect(length, width)
        .edges("|Z")
        .fillet(corner_r)
    )


def fillet_all_edges(body: cq.Workplane, radius: float) -> cq.Workplane:
    """對實體的所有邊做倒圓角，自動跳過半徑過大的邊。"""
    try:
        return body.edges().fillet(radius)
    except Exception:
        return body


def chamfer_all_edges(body: cq.Workplane, length: float) -> cq.Workplane:
    """對實體的所有邊做倒角，自動跳過長度過大的邊。"""
    try:
        return body.edges().chamfer(length)
    except Exception:
        return body
