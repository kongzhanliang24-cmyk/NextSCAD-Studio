"""
智能秤儀表端口與連接器工廠函數。

每個函數回傳兩部分：
  - hole: 從外殼切除的孔形狀（通常沿 panel 法向深度較大，確保 cut 乾淨）
  - parts: dict，包含可見部件（如連接器外殼、按鈕、天綫等），值為 (Workplane, color_name)

座標系約定：
  - 函數內部：端口在 XY 平面上，法向 +Z（孔從 Z=0 向 -Z 延伸，連接器向 +Z 凸出或向 -Z 凹入外殼）
  - 外部裝配時透過 Location 放置到儀表各面板位置
"""

import cadquery as cq

from src.config import (
    USB_W, USB_H, RJ45_W, RJ45_H,
    DB9_W, DB9_H, AVIATION_DIA, POWER_JACK_DIA,
    SMA_DIA, AUDIO_DIA, SIM_W, SIM_H, SD_W, SD_H,
    POWER_BTN_DIA, PINHOLE_DIA, RESET_BTN_DIA,
    ANTENNA_LEN, ANTENNA_DIA, INST_T,
)


# ── 輔助 ──────────────────────────────────────────────────────

def _rect_hole(w: float, h: float, depth: float = 10.0) -> cq.Workplane:
    """通用矩形孔（從 Z=0 向 -Z 延伸 depth）。"""
    return (
        cq.Workplane("XY")
        .box(w, h, depth, centered=(True, True, False))
        .translate((0, 0, -depth))
    )


def _round_hole(dia: float, depth: float = 10.0) -> cq.Workplane:
    """通用圓孔。"""
    return (
        cq.Workplane("XY")
        .circle(dia / 2)
        .extrude(-depth)
    )


def make_rect_port(w: float, h: float):
    """通用矩形端口（寬 w × 高 h）+ 黑色絕緣體。"""
    hole = _rect_hole(w, h, depth=10.0)
    inner = (
        cq.Workplane("XY")
        .box(w - 0.4, h - 0.4, 4.0, centered=(True, True, False))
        .translate((0, 0, -4.5))
    )
    return {"hole": hole, "parts": {"rect_inner": (inner, "gray15")}}


# ── USB-A ─────────────────────────────────────────────────────

def make_usb_port():
    """USB-A 標準。孔向內延伸，可見金屬口向外凸出 0.5mm。"""
    hole = _rect_hole(USB_W, USB_H, depth=15.0)
    # 內部金屬觸點（略凸入孔內）
    inner = (
        cq.Workplane("XY")
        .box(USB_W - 1.0, USB_H - 1.5, 12.0, centered=(True, True, False))
        .translate((0, 0, -13.5))
    )
    # 外框略凸出
    outer = (
        cq.Workplane("XY")
        .box(USB_W + 0.6, USB_H + 0.6, 0.5, centered=(True, True, False))
        .translate((0, 0, -0.5))
    )
    return {
        "hole": hole,
        "parts": {
            "usb_inner": (inner, "gray40"),
            "usb_outer": (outer, "gray70"),
        },
    }


# ── RJ45 ──────────────────────────────────────────────────────

def make_rj45_port():
    """RJ45 標準。帶上方梯形卡扣缺口（簡化為頂部矩形凸出）。"""
    # 主體矩形 + 頂部卡扣缺口
    main = (
        cq.Workplane("XY")
        .box(RJ45_W, RJ45_H, 15.0, centered=(True, True, False))
        .translate((0, 0, -15.0))
    )
    clip = (
        cq.Workplane("XY")
        .box(RJ45_W * 0.45, 3.0, 15.0, centered=(True, True, False))
        .translate((0, RJ45_H / 2 + 1.0, -15.0))
    )
    hole = main.union(clip)
    # 內部黑色塑膠口
    inner = (
        cq.Workplane("XY")
        .box(RJ45_W - 1.0, RJ45_H - 1.5, 13.0, centered=(True, True, False))
        .translate((0, 0, -14.0))
    )
    return {
        "hole": hole,
        "parts": {
            "rj45_inner": (inner, "gray15"),
        },
    }


# ── DB9 ───────────────────────────────────────────────────────

def make_db9_connector(flipped: bool = False, vertical: bool = False):
    """
    DB9 公頭連接器。
      - flipped=True: 梯形倒置（寬邊朝下）
      - vertical=True: 整體旋轉 90°，梯形立著放（長邊垂直）
    """
    top_w = DB9_W
    bot_w = DB9_W - 4.0
    # 內部孔梯形點（XY 平面，長軸沿 X）
    pts = [
        (-top_w / 2, DB9_H / 2),
        (top_w / 2, DB9_H / 2),
        (bot_w / 2, -DB9_H / 2),
        (-bot_w / 2, -DB9_H / 2),
    ]
    if flipped:
        pts = [(x, -y) for (x, y) in pts]

    # 梯形外殼點
    pts_outer = [
        (-(top_w + 2) / 2, (DB9_H + 2) / 2),
        ((top_w + 2) / 2, (DB9_H + 2) / 2),
        ((bot_w + 2) / 2, -(DB9_H + 2) / 2),
        (-(bot_w + 2) / 2, -(DB9_H + 2) / 2),
    ]
    if flipped:
        pts_outer = [(x, -y) for (x, y) in pts_outer]

    # 螺絲柱位置（左右對稱）
    screw_x = (top_w + bot_w) / 4 + 2.5
    screw_positions = [(-screw_x, 0), (screw_x, 0)]

    # DB9 內部針腳排列（9 針 2 排：上 5 下 4）
    pin_positions = []
    pin_pitch = 2.76  # DB9 標準針距
    for i in range(5):
        pin_positions.append((-pin_pitch * 2 + i * pin_pitch, pin_pitch * 0.5))
    for i in range(4):
        pin_positions.append((-pin_pitch * 1.5 + i * pin_pitch, -pin_pitch * 0.5))

    # 若 vertical，將所有點 90° 旋轉（x,y) → (-y, x)
    if vertical:
        pts = [(-y, x) for (x, y) in pts]
        pts_outer = [(-y, x) for (x, y) in pts_outer]
        screw_positions = [(-y, x) for (x, y) in screw_positions]
        pin_positions = [(-y, x) for (x, y) in pin_positions]

    hole = (
        cq.Workplane("XY")
        .polyline(pts)
        .close()
        .extrude(-10.0)
    )
    # ── D 型外殼（梯形管，高 8mm，壁厚 0.8mm）──
    shell_height = 8.0
    shell_solid = (
        cq.Workplane("XY")
        .polyline(pts_outer)
        .close()
        .extrude(shell_height)
    )
    # 內腔（略小於 hole outline）
    shell_cavity = (
        cq.Workplane("XY")
        .polyline(pts)
        .close()
        .extrude(shell_height + 0.1)
        .translate((0, 0, 0.5))
    )
    shell = shell_solid.cut(shell_cavity)

    # ── 內部黑色絕緣體（位於外殼內部底部，z=0 到 z=+5）──
    insulator = (
        cq.Workplane("XY")
        .polyline(pts)
        .close()
        .extrude(5.0)
        .translate((0, 0, 0.3))
    )

    # ── 9 根金色針腳（從絕緣體表面 z=5 凸出 2mm 到 z=7，仍在外殼內）──
    pins = cq.Workplane("XY")
    for (px, py) in pin_positions:
        pins = pins.union(
            cq.Workplane("XY").circle(0.5).extrude(2.0).translate((px, py, 5.0))
        )

    # ── 螺絲柱（左右兩側，凸出 5mm）──
    screws = cq.Workplane("XY")
    for (sx, sy) in screw_positions:
        screws = screws.union(
            cq.Workplane("XY").circle(1.8).extrude(5.0).translate((sx, sy, 0))
        )
        # 螺絲頭（六角）
        screws = screws.union(
            cq.Workplane("XY")
            .polygon(6, 3.5)
            .extrude(0.8)
            .translate((sx, sy, 5.0))
        )

    return {
        "hole": hole,
        "parts": {
            "db9_shell": (shell, "gray60"),
            "db9_insulator": (insulator, "gray10"),
            "db9_pins": (pins, "gold"),
            "db9_screws": (screws, "gray50"),
        },
    }


# ── 航空插頭（傳感器接口）─────────────────────────────────────

def make_aviation_connector():
    """
    M16 航空插頭（4 芯傳感器）。
    結構：六角法蘭 + 螺紋套筒（中空）+ 內部黑色絕緣體 + 4 根金屬針。
    絕緣體凹陷在套筒內 2mm，從外面看得到。
    """
    import math
    hole = _round_hole(AVIATION_DIA, depth=15.0)

    # 外環：六角法蘭（z=0 到 z=2）
    flange = (
        cq.Workplane("XY")
        .polygon(6, AVIATION_DIA + 6)
        .extrude(2.0)
    )
    # 螺紋套筒外壁（z=2 到 z=8）
    sleeve_height = 6.0
    sleeve_outer = (
        cq.Workplane("XY")
        .circle((AVIATION_DIA + 2) / 2)
        .extrude(sleeve_height)
        .translate((0, 0, 2.0))
    )
    # 中空內腔
    sleeve_cavity = (
        cq.Workplane("XY")
        .circle(AVIATION_DIA / 2)
        .extrude(sleeve_height + 0.1)
        .translate((0, 0, 2.0))
    )
    threaded_sleeve = sleeve_outer.cut(sleeve_cavity)
    # 螺紋凹槽
    for z in [3.5, 5.0, 6.5]:
        groove = (
            cq.Workplane("XY")
            .circle((AVIATION_DIA + 2.2) / 2)
            .circle((AVIATION_DIA + 1.6) / 2)
            .extrude(0.3)
            .translate((0, 0, z))
        )
        threaded_sleeve = threaded_sleeve.cut(groove)

    # 內部黑色絕緣體：填在套筒內，z=2 到 z=6（距套筒頂端 2mm，從外面看得到凹陷）
    insulator = (
        cq.Workplane("XY")
        .circle(AVIATION_DIA / 2 - 0.3)
        .extrude(4.0)
        .translate((0, 0, 2.0))
    )

    # 4 芯金屬針：從絕緣體頂面 z=6 凸出 1.5mm 到 z=7.5
    pins = cq.Workplane("XY")
    r = 3.0
    for angle in [45, 135, 225, 315]:
        x = r * math.cos(math.radians(angle))
        y = r * math.sin(math.radians(angle))
        pins = pins.union(
            cq.Workplane("XY")
            .circle(0.8)
            .extrude(1.5)
            .translate((x, y, 6.0))
        )

    return {
        "hole": hole,
        "parts": {
            "av_flange": (flange, "gray55"),
            "av_sleeve": (threaded_sleeve, "gray60"),
            "av_insulator": (insulator, "gray10"),
            "av_pins": (pins, "gold"),
        },
    }


# ── SMA 天綫 ──────────────────────────────────────────────────

def make_sma_antenna():
    """SMA 座 + 黑色橡膠天綫棒（略向上彎）。"""
    hole = _round_hole(SMA_DIA, depth=10.0)
    # 黃銅 SMA 座
    jack = (
        cq.Workplane("XY")
        .circle((SMA_DIA + 2) / 2)
        .extrude(5.0)
    )
    # 天綫棒（豎直圓柱，略粗）
    antenna = (
        cq.Workplane("XY")
        .circle(ANTENNA_DIA / 2)
        .extrude(ANTENNA_LEN)
        .translate((0, 0, 5.0))
    )
    return {
        "hole": hole,
        "parts": {
            "sma_jack": (jack, "gold"),
            "antenna": (antenna, "gray10"),
        },
    }


# ── 電源 DIN 插座 ──────────────────────────────────────────────

def make_power_jack():
    """
    同軸 DC 電源插座（單針中心電極）。
    特徵：中心孔很小（約 5mm），外圍大型裝飾法蘭（POWER_JACK_DIA）使外觀顯大，
    孔內僅 1 根中心金屬針（電源正極）。
    """
    # 中心通孔（實際插頭進入的開口）
    inner_hole_dia = 5.0
    hole = _round_hole(inner_hole_dia, depth=10.0)

    # 外裝飾法蘭：大直徑但薄（1.5mm），覆蓋在孔周圍
    flange_outer = POWER_JACK_DIA  # 12mm
    flange = (
        cq.Workplane("XY")
        .circle(flange_outer / 2)
        .circle(inner_hole_dia / 2 + 0.2)  # 中央讓開孔
        .extrude(1.5)
    )

    # 內環套筒（環繞孔，稍凸出 3mm；孔內壁金屬）
    sleeve = (
        cq.Workplane("XY")
        .circle(inner_hole_dia / 2 + 0.4)
        .circle(inner_hole_dia / 2 - 0.3)  # 中空
        .extrude(3.0)
    )

    # 內部黑色絕緣套筒（孔底部，z=0 至 z=-3）
    insulator = (
        cq.Workplane("XY")
        .circle(inner_hole_dia / 2 - 0.3)
        .extrude(-3.0)
    )

    # 中心針（1.2mm 金針，從孔內絕緣體中心凸出至 z=+2）
    center_pin = (
        cq.Workplane("XY")
        .circle(0.7)
        .extrude(2.0)
        .translate((0, 0, -1.0))
    )

    return {
        "hole": hole,
        "parts": {
            "pwr_flange": (flange, "gray50"),
            "pwr_sleeve": (sleeve, "gray55"),
            "pwr_insulator": (insulator, "gray10"),
            "pwr_center_pin": (center_pin, "gold"),
        },
    }


# ── 電源按鈕 ──────────────────────────────────────────────────

def make_power_button():
    """圓形金屬電源按鈕，凸出外殼 3mm。"""
    hole = _round_hole(POWER_BTN_DIA, depth=10.0)
    # 外環
    ring = (
        cq.Workplane("XY")
        .circle((POWER_BTN_DIA + 2) / 2)
        .extrude(3.0)
    )
    # 中心按鈕（略凹）
    cap = (
        cq.Workplane("XY")
        .circle(POWER_BTN_DIA / 2 - 0.5)
        .extrude(2.0)
    )
    return {
        "hole": hole,
        "parts": {
            "btn_ring": (ring, "gray80"),
            "btn_cap": (cap, "gray70"),
        },
    }


# ── 組合槽（SIM + SD + 耳機）──────────────────────────────────

def make_combo_slot():
    """
    組合插槽（三層佈局）：
      - 上層：SIM 卡槽（長 SIM_W，高 SIM_H）
      - 中層：SD/內容卡槽（長 SD_W，高 SD_H），與 SIM 右對齊
      - 下層：3.5mm 耳機圓孔（左側）
    SIM 與 SD 的右邊界對齊於 x = +10。
    """
    x_right = 10.0  # 兩卡槽共用的右邊界

    # SIM 槽：右邊界 x=+10，中心 x = x_right - SIM_W/2
    sim_cx = x_right - SIM_W / 2
    sim = (
        cq.Workplane("XY")
        .box(SIM_W, SIM_H, 10.0, centered=(True, True, False))
        .translate((sim_cx, 3.0, -10.0))
    )
    # SD 槽：右邊界 x=+10，中心 x = x_right - SD_W/2
    sd_cx = x_right - SD_W / 2
    sd = (
        cq.Workplane("XY")
        .box(SD_W, SD_H, 10.0, centered=(True, True, False))
        .translate((sd_cx, 0.0, -10.0))
    )
    # 耳機圓孔：左下角
    audio = (
        cq.Workplane("XY")
        .circle(AUDIO_DIA / 2)
        .extrude(-10.0)
        .translate((-6.0, -3.5, 0))
    )
    hole = sim.union(sd).union(audio)
    return {
        "hole": hole,
        "parts": {},
    }


# ── 小針孔與凹按鈕 ────────────────────────────────────────────

def make_pinhole():
    """1.5mm 小圓孔（reset 針孔）。"""
    hole = _round_hole(PINHOLE_DIA, depth=10.0)
    return {"hole": hole, "parts": {}}


def make_reset_button():
    """凹陷的小按鈕。"""
    hole = _round_hole(RESET_BTN_DIA, depth=10.0)
    # 內部凹陷的按鈕帽（往內凹 1.5mm）
    cap = (
        cq.Workplane("XY")
        .circle(RESET_BTN_DIA / 2 - 0.3)
        .extrude(1.0)
        .translate((0, 0, -2.5))
    )
    return {
        "hole": hole,
        "parts": {
            "reset_cap": (cap, "gray30"),
        },
    }
