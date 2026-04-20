"""
Philips USB 3.0 滑盖式随身碟 – CadQuery 参数化模型
===================================================
参考实物照片建模：
  - 主体：深灰色矩形塑料壳，四周圆角
  - 滑盖：黑色塑料，可向后滑动露出 USB-A 接头
  - USB-A 3.0 接口：银色金属外壳 + 蓝色塑料舌片
  - 顶面 PHILIPS 品牌标牌
  - 尾部挂绳孔（方形开口）
  - 侧面滑轨沟槽
"""

import cadquery as cq

# ── 总体尺寸 ──────────────────────────────────────────────────
BODY_L = 46.0          # 主体长度 (Y)
BODY_W = 20.0          # 主体宽度 (X)
BODY_H = 10.0          # 主体厚度 (Z)
BODY_R = 1.8           # 主体边缘圆角

# ── 滑盖 ──
CAP_L = 24.0           # 滑盖长度 (Y)
CAP_W = BODY_W + 0.6   # 略宽于主体
CAP_H = BODY_H + 0.6   # 略厚于主体
CAP_R = 2.0            # 滑盖边缘圆角
CAP_WALL = 1.5         # 滑盖壁厚

# ── USB-A 3.0 接口 ──
USB_L = 14.0           # USB 接头长度 (Y 方向伸出)
USB_W = 12.0           # USB 金属外壳宽度
USB_H = 4.5            # USB 金属外壳高度
USB_TONGUE_W = 10.0    # 蓝色舌片宽度
USB_TONGUE_H = 1.5     # 蓝色舌片厚度
USB_TONGUE_L = 10.0    # 蓝色舌片长度

# ── 挂绳孔 ──
LOOP_W = 8.0           # 挂绳孔宽度
LOOP_H = 4.0           # 挂绳孔高度
LOOP_WALL = 2.5        # 孔周围壁厚

# ── 侧面滑轨槽 ──
RAIL_D = 0.6           # 滑轨槽深
RAIL_H = 1.2           # 滑轨槽高
RAIL_L = BODY_L - 4.0  # 滑轨槽长度

# ── 顶面凹区（品牌标牌区域）──
TOP_RECESS_L = 28.0
TOP_RECESS_W = 14.0
TOP_RECESS_D = 0.5     # 凹深

# ── LED 指示灯小孔 ──
LED_R = 0.8

# ── 颜色 ──
BODY_COLOR   = cq.Color(0.28, 0.28, 0.30, 1.0)   # 深灰色主体
CAP_COLOR    = cq.Color(0.12, 0.12, 0.14, 1.0)    # 黑色滑盖
USB_COLOR    = cq.Color(0.75, 0.75, 0.75, 1.0)    # 银色金属
TONGUE_COLOR = cq.Color(0.15, 0.30, 0.85, 1.0)    # USB 3.0 蓝色
LOGO_COLOR   = cq.Color(0.70, 0.70, 0.68, 1.0)    # 银灰色 PHILIPS 标牌
LED_COLOR    = cq.Color(0.1, 0.7, 0.2, 0.9)       # 绿色 LED


def _box(w, d, h, x=0.0, y=0.0, z=0.0):
    return cq.Workplane("XY").box(w, d, h).translate((x, y, z))


# ─────────────────── 主体外壳 ───────────────────
def _make_body() -> cq.Workplane:
    """主体：矩形圆角塑料壳，含顶面凹区和侧面滑轨槽。"""
    body = (
        cq.Workplane("XY")
        .box(BODY_W, BODY_L, BODY_H)
        .edges("|Z").fillet(BODY_R)
        .edges("|X").fillet(0.8)
    )

    # 顶面品牌凹区
    recess = (
        cq.Workplane("XY")
        .box(TOP_RECESS_W, TOP_RECESS_L, TOP_RECESS_D * 2)
        .translate((0, -2.0, BODY_H / 2 - TOP_RECESS_D + 0.1))
    )
    recess = recess.edges("|Z").fillet(1.5)
    body = body.cut(recess)

    # 左右侧面滑轨槽
    for sign in [-1, 1]:
        rail = _box(RAIL_D * 2, RAIL_L, RAIL_H,
                    sign * (BODY_W / 2), 0, 0)
        body = body.cut(rail)

    return body


# ─────────────────── 滑盖 ───────────────────
def _make_cap() -> cq.Workplane:
    """滑盖：黑色塑料，包裹主体前半部分。"""
    # 外壳
    outer = (
        cq.Workplane("XY")
        .box(CAP_W, CAP_L, CAP_H)
        .edges("|Z").fillet(CAP_R)
        .edges("|X").fillet(1.0)
    )
    # 内腔挖空
    inner = (
        cq.Workplane("XY")
        .box(CAP_W - CAP_WALL * 2, CAP_L + 2.0, CAP_H - CAP_WALL * 2)
    )
    inner = inner.edges("|Z").fillet(BODY_R)
    cap = outer.cut(inner)

    # 移到主体尾部位置（滑盖收回状态）
    cap = cap.translate((0, (BODY_L - CAP_L) / 2 + 1.0, 0))

    return cap


# ─────────────────── 挂绳孔 ───────────────────
def _make_lanyard_loop() -> cq.Workplane:
    """尾部挂绳孔：方形贯穿孔。"""
    # 外框
    frame_w = LOOP_W + LOOP_WALL * 2
    frame_h = LOOP_H + LOOP_WALL * 2
    frame_l = 3.5
    frame = (
        cq.Workplane("XY")
        .box(frame_w, frame_l, frame_h)
        .edges("|Z").fillet(1.5)
        .edges("|X").fillet(0.8)
    )
    # 贯穿孔
    hole = (
        cq.Workplane("XY")
        .box(LOOP_W, frame_l + 2.0, LOOP_H)
        .edges("|Y").fillet(0.8)
    )
    loop = frame.cut(hole)
    # 移到尾端
    loop = loop.translate((0, BODY_L / 2 + frame_l / 2 - 0.5, 0))
    return loop


# ─────────────────── USB-A 金属接头 ───────────────────
def _make_usb_connector() -> cq.Workplane:
    """USB-A 3.0 金属外壳。"""
    shell = (
        cq.Workplane("XY")
        .box(USB_W, USB_L, USB_H)
        .edges("|Z").fillet(0.5)
    )
    # 内腔
    inner = (
        cq.Workplane("XY")
        .box(USB_W - 0.8, USB_L - 1.0, USB_H - 0.8)
        .translate((0, -0.5, 0))
    )
    connector = shell.cut(inner)
    # 定位：伸出主体前端
    connector = connector.translate((0, -BODY_L / 2 - USB_L / 2 + 1.0, -0.5))
    return connector


# ─────────────────── USB 蓝色舌片 ───────────────────
def _make_usb_tongue() -> cq.Workplane:
    """USB 3.0 蓝色塑料舌片。"""
    tongue = (
        cq.Workplane("XY")
        .box(USB_TONGUE_W, USB_TONGUE_L, USB_TONGUE_H)
        .edges("|Z").fillet(0.3)
        .translate((0, -BODY_L / 2 - USB_TONGUE_L / 2 + 1.5, -USB_H / 2 + USB_TONGUE_H / 2 + 0.3 - 0.5))
    )
    return tongue


# ─────────────────── USB 接头内部触点 ───────────────────
def _make_usb_pins() -> list[cq.Workplane]:
    """USB-A 内部金属触点（4颗）。"""
    pins = []
    pin_w = 1.2
    pin_h = 0.4
    pin_l = 8.0
    spacing = 2.5
    start_x = -spacing * 1.5
    for i in range(4):
        pin = (
            cq.Workplane("XY")
            .box(pin_w, pin_l, pin_h)
            .translate((
                start_x + i * spacing,
                -BODY_L / 2 - pin_l / 2 + 2.0,
                -USB_H / 2 + pin_h / 2 + USB_TONGUE_H + 0.6 - 0.5
            ))
        )
        pins.append(pin)
    return pins


# ─────────────────── 品牌标牌 ───────────────────
def _make_logo() -> cq.Workplane:
    """PHILIPS 品牌标牌（顶面凹区内的凸起标牌）。"""
    logo = (
        cq.Workplane("XY")
        .box(12.0, 5.0, 0.3)
        .edges("|Z").fillet(0.5)
        .translate((0, -2.0, BODY_H / 2 - TOP_RECESS_D + 0.25))
    )
    return logo


# ─────────────────── LED 指示灯 ───────────────────
def _make_led() -> cq.Workplane:
    """LED 指示灯小点。"""
    led = (
        cq.Workplane("XY")
        .circle(LED_R)
        .extrude(0.5)
        .translate((BODY_W / 2 - 3.0, -BODY_L / 2 + 4.0, BODY_H / 2 - 0.3))
    )
    return led


# ─────────────────── 底部标签 ───────────────────
def _make_bottom_label() -> cq.Workplane:
    """底部产品标签。"""
    label = _box(14.0, 18.0, 0.2, 0, 2.0, -BODY_H / 2 + 0.15)
    return label


# ═══════════════════ 组装 ═══════════════════
def make_usb_flash_drive() -> cq.Assembly:
    assy = cq.Assembly(name="usb_flash_drive")

    assy.add(_make_body(),          name="body",          color=BODY_COLOR)
    assy.add(_make_cap(),           name="cap",           color=CAP_COLOR)
    assy.add(_make_lanyard_loop(),  name="lanyard_loop",  color=CAP_COLOR)
    assy.add(_make_usb_connector(), name="usb_connector", color=USB_COLOR)
    assy.add(_make_usb_tongue(),    name="usb_tongue",    color=TONGUE_COLOR)
    assy.add(_make_logo(),          name="logo",          color=LOGO_COLOR)
    assy.add(_make_led(),           name="led",           color=LED_COLOR)
    assy.add(_make_bottom_label(),  name="bottom_label",  color=cq.Color(0.9, 0.9, 0.87, 1.0))

    for idx, pin in enumerate(_make_usb_pins()):
        assy.add(pin, name=f"usb_pin_{idx}", color=USB_COLOR)

    return assy
