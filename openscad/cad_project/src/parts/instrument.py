"""
智能秤儀表主體裝配。

座標系：
  - 原點在儀表幾何中心
  - X 軸：寬度（左右），+X 為右
  - Y 軸：深度（前後），-Y 為前（屏幕朝向），+Y 為後
  - Z 軸：高度（上下），+Z 為上

六個面：
  - 前面 (−Y)：屏幕 + 邊框
  - 後面 (+Y)：天綫、RS232、傳感器、電源等連接器
  - 底面 (−Z)：USB/RJ45/SIM/SD/耳機/按鈕/針孔
  - 右面 (+X)：電源按鈕
  - 頂面 (+Z) 與左面 (−X)：無特殊物件
"""

import cadquery as cq

from src.config import (
    INST_W, INST_H, INST_D, INST_T,
    SCREEN_W, SCREEN_H, SCREEN_RECESS,
)
from src.parts.instrument_common import (
    make_usb_port, make_rj45_port, make_db9_connector,
    make_aviation_connector, make_sma_antenna, make_power_jack,
    make_power_button, make_combo_slot, make_pinhole, make_reset_button,
    make_rect_port,
)


# ── 面法向旋轉矩陣 ────────────────────────────────────────────
# 把端口的局部 +Z 軸對齊到各面的外法向

FACE_ROTATIONS = {
    # (axis, angle)：對應 rotate((0,0,0), axis, angle) 的參數
    "front":  ((1, 0, 0),  90),   # +Z → −Y
    "back":   ((1, 0, 0), -90),   # +Z → +Y
    "bottom": ((1, 0, 0), 180),   # +Z → −Z
    "top":    ((0, 0, 1),   0),   # +Z → +Z（無旋轉）
    "right":  ((0, 1, 0),  90),   # +Z → +X（右手定則繞 +Y 軸 +90°）
    "left":   ((0, 1, 0), -90),   # +Z → −X
}

FACE_POSITIONS = {
    "front":  (0, -INST_D / 2, 0),
    "back":   (0,  INST_D / 2, 0),
    "bottom": (0,  0, -INST_H / 2),
    "top":    (0,  0,  INST_H / 2),
    "right":  ( INST_W / 2, 0, 0),
    "left":   (-INST_W / 2, 0, 0),
}


def _place(shape: cq.Workplane, face: str, u: float, v: float) -> cq.Workplane:
    """
    將 shape 放置到指定面的 (u, v) 位置。
    u/v 是面內的局部 2D 座標（對應旋轉後的 X/Y）。
    shape 的局部 +Z 會對齊該面的外法向。
    """
    axis, angle = FACE_ROTATIONS[face]
    fx, fy, fz = FACE_POSITIONS[face]
    # 先旋轉，再平移到面上的 (u, v) 位置
    rotated = shape.rotate((0, 0, 0), axis, angle)
    # 面內 u, v 偏移取決於旋轉後的局部 X, Y 軸映射
    # 簡單做法：對每個面單獨計算 u, v 到世界座標的貢獻
    if face == "front":
        return rotated.translate((u, fy, v))
    elif face == "back":
        return rotated.translate((-u, fy, v))
    elif face == "bottom":
        return rotated.translate((u, -v, fz))
    elif face == "top":
        return rotated.translate((u, v, fz))
    elif face == "right":
        return rotated.translate((fx, -u, v))
    elif face == "left":
        return rotated.translate((fx, u, v))
    else:
        raise ValueError(f"Unknown face: {face}")


# ── 外殼（鈑金折彎板件）─────────────────────────────────────

# 前邊框包邊深度（四邊向後延伸包住侧面的長度）
BEZEL_WRAP = 6.0

def make_panels() -> dict:
    """
    鈑金外殼拆分為 2 個獨立件：
      - body  : 後殼一體件（後 + 上 + 下 + 左 + 右，U 型折彎），前面開口
      - front : 前邊框（主板 + 四邊包邊）

    後殼以 union 整合五面，模擬鈑金折彎一體成型，面接縫無縫線。
    折彎內角加小圓角（fillet）以模擬真實鈑金工藝。
    """
    t = INST_T
    W, H, D = INST_W, INST_H, INST_D
    bezel_wrap = BEZEL_WRAP
    bend_r = 0.8  # 折彎內圓角半徑（鈑金工藝常見 0.5-1.5mm）

    def _bx(sx, sy, sz, cx, cy, cz):
        return cq.Workplane("XY").box(sx, sy, sz).translate((cx, cy, cz))

    # Y 座標
    back_y = D / 2 - t / 2
    front_y = -D / 2 + t / 2
    bezel_y = -D / 2 + t + bezel_wrap / 2
    side_y_front = -D / 2 + t + bezel_wrap
    side_y_back = D / 2 - t
    side_y_len = side_y_back - side_y_front
    side_y_c = (side_y_front + side_y_back) / 2

    inner_w = W - 2 * t
    lx, rx = -W / 2 + t / 2, W / 2 - t / 2
    bz, tz = -H / 2 + t / 2, H / 2 - t / 2

    # ── 後殼一體件（U 型折彎）──
    # 後板佔滿 W × H；四側板延伸到 side_y_front（覆蓋到前邊框包邊後方）
    back_panel = _bx(W, t, H, 0, back_y, 0)
    left_panel = _bx(t, side_y_len, H, lx, side_y_c, 0)
    right_panel = _bx(t, side_y_len, H, rx, side_y_c, 0)
    bottom_panel = _bx(inner_w, side_y_len, t, 0, side_y_c, bz)
    top_panel = _bx(inner_w, side_y_len, t, 0, side_y_c, tz)
    body = (
        back_panel
        .union(left_panel)
        .union(right_panel)
        .union(bottom_panel)
        .union(top_panel)
    )
    # 折彎內圓角：選擇 body 外表面上的銳利豎直/水平邊
    # 用包圍盒過濾：四條後-側折彎邊（沿 Z 或沿 X 方向，靠近後板與側板交界）
    try:
        body = body.edges("|Z").fillet(bend_r)
    except Exception:
        pass  # 若某些邊因端口孔存在無法 fillet，退回直角

    # ── 底部 I/O 凹陷：寬度包住所有端口（含左右 8mm 邊距）──
    io_w = BOTTOM_IO_X_RIGHT - BOTTOM_IO_X_LEFT
    io_x_c = (BOTTOM_IO_X_LEFT + BOTTOM_IO_X_RIGHT) / 2
    io_d = side_y_len - 8.0
    io_depth = 1.2
    io_recess = _bx(
        io_w, io_d, io_depth, io_x_c, side_y_c, -H / 2 + io_depth / 2
    )
    body = body.cut(io_recess)

    # ── 前邊框：單一中空殼體（outer − inner cavity）──
    # 外殼：滿 W × H，Y 方向從 -D/2 延伸到 -D/2 + t + bezel_wrap
    bezel_total_d = t + bezel_wrap
    bezel_center_y = -D / 2 + bezel_total_d / 2
    front_outer = _bx(W, bezel_total_d, H, 0, bezel_center_y, 0)
    # 內腔：從主板後側開始向後掏空（X/Z 各內縮 t），整個貫穿包邊深度
    cavity_y_start = -D / 2 + t
    cavity_y_end = -D / 2 + bezel_total_d + 0.1
    cavity_d = cavity_y_end - cavity_y_start
    cavity_cy = (cavity_y_start + cavity_y_end) / 2
    front_cavity = _bx(W - 2 * t, cavity_d, H - 2 * t, 0, cavity_cy, 0)
    front = front_outer.cut(front_cavity)
    # 切屏幕窗
    front = front.cut(_bx(SCREEN_W, t * 3, SCREEN_H, 0, front_y, 0))

    return {
        "body": body,
        "front": front,
    }


# 面到板件的映射（後/上/下/左/右 全部屬於 body 一體件）
FACE_TO_PANEL = {
    "back":   "body",
    "bottom": "body",
    "top":    "body",
    "left":   "body",
    "right":  "body",
    "front":  "front",
}


def make_screen() -> cq.Workplane:
    """
    LCD 屏幕面板：薄平板，凹陷在前邊框內。
    此面板將在後處理中套用 app 截圖 texture。
    """
    screen = cq.Workplane("XY").box(SCREEN_W, 1.5, SCREEN_H)
    # 前面略凹陷（從 -INST_D/2 向內 SCREEN_RECESS）
    screen = screen.translate((0, -INST_D / 2 + SCREEN_RECESS + 0.75, 0))
    return screen


# ── 底部端口布局 ──────────────────────────────────────────────
# 設計原則：
#   - 主端口群（USB×2、RJ45×2、combo、rect_port）整體從中心偏左
#   - 最右端 pinhole 約在 +85
#   - 最左端 pinhole 不靠邊，距「左第二口（矩形）」左邊約 7mm
#
# 左第二口：矩形 7×4.5mm（代替原 reset 按鈕）
# 左第三口：combo_slot（SIM=20 + SD=15 右對齊）

_RECT_PORT_W = 7.0

# (factory_callable, x_position)
_BOTTOM_PORTS_SPEC = [
    (make_pinhole,                            85.0),   # 最右
    (make_usb_port,                           60.0),
    (make_usb_port,                           42.0),
    (make_rj45_port,                          17.0),
    (make_rj45_port,                          -3.0),
    (make_combo_slot,                        -28.0),   # SIM+SD+audio
    (lambda: make_rect_port(_RECT_PORT_W, 4.5), -52.0),  # 左第二：矩形口
    # 最左 pinhole：距矩形口「左邊緣」(-55.5) 再 -7mm = -62.5
    (make_pinhole,                           -62.5),
]

_BOTTOM_PORT_X = [x for _, x in _BOTTOM_PORTS_SPEC]

# I/O 凹陷矩形 X 範圍（含全部端口 + 左右各 8mm 邊距）
BOTTOM_IO_MARGIN = 8.0
BOTTOM_IO_X_LEFT = min(_BOTTOM_PORT_X) - BOTTOM_IO_MARGIN
BOTTOM_IO_X_RIGHT = max(_BOTTOM_PORT_X) + BOTTOM_IO_MARGIN


def _bottom_ports() -> list:
    """底面端口布局（從右到左）。"""
    y_center = 0.0
    return [
        (factory(), x, y_center)
        for factory, x in _BOTTOM_PORTS_SPEC
    ]


def _back_ports() -> list:
    """
    後面端口布局（從上到下），靠近右側面（距右邊 15mm）。
    後面座標：_place 套用 (-u, y, v)，故 u = -(世界 X 目標位置)。
    RS232 DB9 立著放（vertical）。
    """
    back_x_from_right = 15.0  # 距右邊緣 15mm
    world_x = INST_W / 2 - back_x_from_right  # = 135 - 15 = 120
    u = -world_x  # = -120
    return [
        (make_sma_antenna(),                             u,  65),
        (make_db9_connector(vertical=True),              u,  32),
        (make_aviation_connector(),                      u,   0),
        (make_db9_connector(vertical=True, flipped=True), u, -32),
        (make_power_jack(),                              u, -60),
    ]


def _right_ports() -> list:
    """
    右側端口（電源按鈕）。
    按鈕靠近頂部，距頂邊約 10mm。
    """
    from src.config import POWER_BTN_DIA
    # v = world Z 位置；距頂部 10mm 意味著按鈕中心 z = INST_H/2 - 10 - radius
    btn_z = INST_H / 2 - 10.0 - POWER_BTN_DIA / 2
    return [
        (make_power_button(), 0, btn_z),
    ]


# ── 主裝配 ────────────────────────────────────────────────────

def make_instrument() -> cq.Assembly:
    """
    創建完整智能秤儀表裝配體（鈑金折彎生產風格）。
    """
    assy = cq.Assembly(name="instrument")

    # ── 獨立鈑金板件 ──
    panels = make_panels()

    # 按面分組收集端口孔與可見部件
    panel_holes: dict = {k: None for k in panels.keys()}
    port_parts = []  # [(placed_workplane, color_name, name), ...]

    def _add_port(port_dict, face, u, v, name_prefix):
        panel_name = FACE_TO_PANEL[face]
        hole = port_dict["hole"]
        placed_hole = _place(hole, face, u, v)
        if panel_holes[panel_name] is None:
            panel_holes[panel_name] = placed_hole
        else:
            panel_holes[panel_name] = panel_holes[panel_name].union(placed_hole)
        for pname, (part, color) in port_dict["parts"].items():
            placed_part = _place(part, face, u, v)
            port_parts.append((placed_part, color, f"{name_prefix}_{pname}"))

    # 底面端口
    for i, (pd, u, v) in enumerate(_bottom_ports()):
        _add_port(pd, "bottom", u, v, f"bot_{i}")
    # 後面端口
    for i, (pd, u, v) in enumerate(_back_ports()):
        _add_port(pd, "back", u, v, f"back_{i}")
    # 右面端口
    for i, (pd, u, v) in enumerate(_right_ports()):
        _add_port(pd, "right", u, v, f"right_{i}")

    # 從各板件切除對應孔
    for name, panel in panels.items():
        if panel_holes[name] is not None:
            panel = panel.cut(panel_holes[name])
        assy.add(panel, name=f"panel_{name}", color=cq.Color("gray90"))

    # ── 前邊框側邊包邊上的螺絲（左右各 2 顆，共 4 顆）──
    # 螺絲穿過包邊鎖入侧板；螺頭露在包邊外表面
    # 上下各靠近邊緣 25mm 處
    screw_head_dia = 4.0
    screw_head_h = 1.2
    # 包邊 Y 中心位置（bezel_y = -D/2 + t + bezel_wrap/2）
    screw_y = -INST_D / 2 + INST_T + BEZEL_WRAP / 2
    # 上下分布二顆：距頂邊/底邊 25mm
    screw_z_upper = INST_H / 2 - 25.0
    screw_z_lower = -INST_H / 2 + 25.0
    for screw_z, z_label in [(screw_z_upper, "upper"), (screw_z_lower, "lower")]:
        for x_sign, x_label in [(-1, "left"), (1, "right")]:
            # 用 YZ 平面建號，後續立起往 ±X 方向 extrude
            screw = (
                cq.Workplane("YZ")
                .circle(screw_head_dia / 2)
                .extrude(screw_head_h * x_sign)
                .translate((x_sign * INST_W / 2, screw_y, screw_z))
            )
            assy.add(
                screw,
                name=f"side_screw_{x_label}_{z_label}",
                color=cq.Color("gray50"),
            )

    # ── 屏幕（特殊標記色，便於後處理識別貼圖）──
    screen = make_screen()
    # 使用純白色作為屏幕標記（後處理時透過顏色找到此 mesh）
    assy.add(screen, name="screen", color=cq.Color(1.0, 1.0, 1.0, 1.0))

    # ── 所有端口可見部件 ──
    for part, color, name in port_parts:
        assy.add(part, name=name, color=cq.Color(color))

    return assy
