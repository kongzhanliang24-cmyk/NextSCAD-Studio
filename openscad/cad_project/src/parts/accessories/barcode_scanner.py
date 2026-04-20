"""
科密 EP-9100 有线二维影像式扫描枪模型（重建版）。

参考尺寸（规格图）：170 × 100 × 70 mm
接口：USB 有线，数据线 1.5m

建模策略：
  - 避免 loft，全部用简单拉伸 + 圆角 + 布尔运算
  - 扫描头 = 大圆角方盒（蘑菇头）
  - 手柄   = 圆角矩形拉伸 + 底部锥切
  - 颈部   = 圆角方盒过渡
  - 所有零件竖直建模（Z 向上），最后整体倾斜
"""

import cadquery as cq
import math

# ── 总体尺寸 ──────────────────────────────────────────────────
TOTAL_H = 170.0          # 手柄底→扫描头顶（Z 方向）
HEAD_W = 68.0            # 扫描头 X 宽
HEAD_D = 74.0            # 扫描头 Y 深
HEAD_H = 30.0            # 扫描头 Z 高

NECK_W = 40.0            # 颈部 X 宽
NECK_D = 36.0            # 颈部 Y 深
NECK_H = 18.0            # 颈部 Z 高（加高过渡更流畅）

GRIP_R = 17.5            # 手柄长轴半径
GRIP_RY = 12.5           # 手柄短轴半径
GRIP_H = 114.0           # 手柄 Z 高

TILT_DEG = 0.0           # 通过本体轮廓体现姿态，不再整体倾斜

HEAD_Y = -14.0
NECK_Y = -8.0
TRIGGER_Y = -12.0

# ── 扫描窗口 ──
WIN_W = 38.0             # 小於扫描头正面宽度
WIN_H = 22.0             # 小於扫描头正面高度

# ── 颜色（淡绿色外壳）──
BODY_COLOR    = cq.Color(0.55, 0.78, 0.58, 1.0)
GRIP_COLOR    = cq.Color(0.48, 0.72, 0.52, 1.0)
WINDOW_COLOR  = cq.Color(0.10, 0.10, 0.16, 0.88)
LED_COLOR     = cq.Color(0.1, 0.5, 0.95, 1.0)
TRIGGER_COLOR = cq.Color(0.42, 0.65, 0.46, 1.0)
CABLE_COLOR   = cq.Color(0.18, 0.18, 0.18, 1.0)
RUBBER_COLOR  = cq.Color(0.14, 0.14, 0.14, 1.0)
LABEL_COLOR   = cq.Color(0.90, 0.90, 0.87, 1.0)
SCREW_COLOR   = cq.Color(0.45, 0.45, 0.45, 1.0)
LOGO_COLOR    = cq.Color(0.80, 0.80, 0.78, 1.0)

# 扫描头底部 Z 坐标
_HEAD_Z0 = GRIP_H - 6.0

def _box(w, d, h, x=0.0, y=0.0, z=0.0):
    return cq.Workplane("XY").box(w, d, h).translate((x, y, z))

def _tilt(obj: cq.Workplane) -> cq.Workplane:
    """统一的整体前倾。"""
    return obj.rotate((0, 0, 0), (1, 0, 0), TILT_DEG)

# ─────────────────── 扫描头 ───────────────────
def _make_scan_head() -> cq.Workplane:
    """
    冲浪板/鹅卵石形扫描头：
    用椭圆截面拉伸 + 顶部大圆角做出光滑穹顶。
    """
    # 方盒 + 大圆角 → 鹅卵石/子弹头形
    head = (
        cq.Workplane("XY")
        .box(HEAD_W, HEAD_D, HEAD_H)
        .translate((0, HEAD_Y, _HEAD_Z0 + HEAD_H / 2))
    )
    # 竖直边大圆角 → 俯视接近椭圆
    head = head.edges("|Z").fillet(HEAD_W * 0.22)
    # 顶部圆角 → 光滑穹顶
    head = head.edges(">Z").fillet(10.0)
    # 底部轻微圆角
    head = head.edges("<Z").fillet(4.0)

    top_recess = (
        cq.Workplane("XY")
        .ellipse(HEAD_W * 0.20, HEAD_D * 0.24)
        .extrude(2.6)
        .translate((0, HEAD_Y + 6.0, _HEAD_Z0 + HEAD_H - 1.3))
    )
    head = head.cut(top_recess)

    # 扫描窗口凹槽（前面 -Y 方向，深 8mm）
    win_recess = _box(WIN_W + 3.0, 7.0, WIN_H + 2.0, 0, HEAD_Y - HEAD_D / 2 + 3.5, _HEAD_Z0 + HEAD_H / 2 - 1.0)
    head = head.cut(win_recess)

    # 蜂鸣器 3 条槽（顶面靠前）
    for i in range(3):
        slot = _box(7.0, 1.6, 6.0, 0, HEAD_Y + 10.0 + i * 3.2, _HEAD_Z0 + HEAD_H - 1.5)
        head = head.cut(slot)

    # LED 指示灯长槽（顶面中后部纵向）
    led_slot = _box(3.0, 14.0, 4.5, 0, HEAD_Y + 1.0, _HEAD_Z0 + HEAD_H - 1.5)
    head = head.cut(led_slot)

    return _tilt(head)

# ─────────────────── 扫描窗口 ───────────────────
def _make_scan_window_glass() -> cq.Workplane:
    """扫描窗口玻璃面：内嵌到正面深5mm的位置。"""
    glass = (
        cq.Workplane("XY")
        .box(WIN_W, 1.6, WIN_H)
        .edges("|Y").fillet(1.5)
        .translate((0, HEAD_Y - HEAD_D / 2 + 5.0, _HEAD_Z0 + HEAD_H / 2 - 1.0))
    )
    return _tilt(glass)

# ─────────────────── LED 指示灯 ───────────────────
def _make_led_insert() -> cq.Workplane:
    led = _box(2.5, 14.0, 2.0, 0, HEAD_Y + 4.0, _HEAD_Z0 + HEAD_H - 1.2)
    return _tilt(led)

# ─────────────────── 颈部过渡 ───────────────────
def _make_neck() -> cq.Workplane:
    """流畅过渡段：圆柱手柄 → 椭圆扫描头，用圆角方盒模拟。"""
    neck = (
        cq.Workplane("XY")
        .box(NECK_W, NECK_D, NECK_H)
        .translate((0, NECK_Y, _HEAD_Z0 - 6.0 + NECK_H / 2))
    )
    neck = neck.edges("|Z").fillet(10.0)
    neck = neck.edges(">Z").fillet(5.0)
    neck = neck.edges("<Z").fillet(4.0)
    return _tilt(neck)

# ─────────────────── 扳机 ───────────────────
def _make_trigger() -> cq.Workplane:
    """扳机：嵌入扫描头与手柄交接的下方偏前。"""
    trigger = (
        cq.Workplane("XY")
        .box(18.0, 11.0, 28.0)
        .translate((0, TRIGGER_Y, _HEAD_Z0 - 12.0))
    )
    trigger = trigger.edges().fillet(3.5)
    return _tilt(trigger)

# ─────────────────── 手柄 ───────────────────
def _make_grip() -> cq.Workplane:
    """手柄：椭圆形，底部圆球膨大。"""
    # 主手柄轮廓：椭圆截面渐变，形成更接近实拍的人机工学握柄
    grip = (
        cq.Workplane("XY")
        .ellipse(GRIP_R + 1.5, GRIP_RY + 1.2)
        .workplane(offset=14.0)
        .center(0, 2.0)
        .ellipse(GRIP_R + 2.0, GRIP_RY + 1.5)
        .workplane(offset=28.0)
        .center(0, 0.0)
        .ellipse(GRIP_R + 1.0, GRIP_RY + 1.0)
        .workplane(offset=30.0)
        .center(0, -4.0)
        .ellipse(GRIP_R, GRIP_RY)
        .workplane(offset=30.0)
        .center(0, -8.0)
        .ellipse(GRIP_R - 1.5, GRIP_RY - 1.0)
        .loft(combine=True)
    )

    heel = (
        cq.Workplane("XY")
        .box((GRIP_R + 4.5) * 2, (GRIP_RY + 2.5) * 2, 14.0)
        .translate((0, 4.0, 7.0))
    )
    heel = heel.edges("|Z").fillet(7.0)
    heel = heel.edges(">Z").fillet(3.0)
    grip = grip.union(heel)

    scoop_len = (GRIP_R + 8.0) * 2
    scoop = (
        cq.Workplane("YZ")
        .ellipse(10.0, 14.0)
        .extrude(scoop_len)
        .translate((-scoop_len / 2, -16.0, 62.0))
    )
    grip = grip.cut(scoop)

    return _tilt(grip)

# ─────────────────── 底部唇边 ───────────────────
def _make_head_lip() -> cq.Workplane:
    """扫描头底部突出唇边。"""
    lip = (
        cq.Workplane("XY")
        .box(HEAD_W + 2.0, HEAD_D + 2.0, 4.0)
        .translate((0, HEAD_Y, _HEAD_Z0 + 2.0))
    )
    lip = lip.edges("|Z").fillet(HEAD_W * 0.23)
    lip = lip.edges("<Z").fillet(1.5)
    inner = (
        cq.Workplane("XY")
        .box(HEAD_W - 5.0, HEAD_D - 5.0, 6.0)
        .translate((0, HEAD_Y, _HEAD_Z0 + 2.0))
    )
    inner = inner.edges("|Z").fillet(HEAD_W * 0.20)
    lip = lip.cut(inner)
    return _tilt(lip)

# ─────────────────── 品牌标牌 ───────────────────
def _make_brand_logo() -> cq.Workplane:
    logo = (
        cq.Workplane("XZ")
        .ellipse(10.0, 6.5)
        .extrude(1.0)
        .translate((0, HEAD_Y - HEAD_D / 2 + 0.6, _HEAD_Z0 + 7.0))
    )
    return _tilt(logo)

# ─────────────────── 底部标签 ───────────────────
def _make_bottom_label() -> cq.Workplane:
    label = _box(30.0, 16.0, 0.5, 0, HEAD_Y + 10.0, _HEAD_Z0 + 0.3)
    return _tilt(label)

# ─────────────────── 底部螺丝 ───────────────────
def _make_bottom_screws() -> list[cq.Workplane]:
    screws = []
    for x in [-16.0, 16.0]:
        s = (
            cq.Workplane("XY")
            .circle(2.0)
            .extrude(1.2)
            .translate((x, HEAD_Y + 7.0, _HEAD_Z0 + 0.2))
        )
        screws.append(_tilt(s))
    return screws

# ─────────────────── 线缆出口 ───────────────────
def _make_cable_guard() -> cq.Workplane:
    guard = (
        cq.Workplane("XY")
        .ellipse(GRIP_R + 1.0, GRIP_RY + 1.0)
        .extrude(6.0)
    )
    guard_hole = (
        cq.Workplane("XY")
        .ellipse(GRIP_R - 2.0, GRIP_RY - 2.0)
        .extrude(6.2)
    )
    guard = guard.cut(guard_hole).translate((0, 0, -1.0))
    return _tilt(guard)

def _make_cable_tube() -> cq.Workplane:
    tube = (
        cq.Workplane("XY")
        .circle(4.5)
        .extrude(-20.0)
        .translate((0, 0, -1.0))
    )
    return _tilt(tube)

def _make_cable_segment() -> cq.Workplane:
    cable = (
        cq.Workplane("XY")
        .circle(2.5)
        .extrude(-45.0)
        .translate((0, 0, -19.0))
    )
    return _tilt(cable)

# ─────────────────── 侧面标签（序列号条码）───────────────────
def _make_side_label() -> cq.Workplane:
    label = _box(1.0, 14.0, 10.0, HEAD_W / 2 - 0.8, HEAD_Y + 6.0, _HEAD_Z0 + 10.0)
    return _tilt(label)

# ═══════════════════ 组装 ═══════════════════
def make_barcode_scanner() -> cq.Assembly:
    assy = cq.Assembly(name="barcode_scanner")

    assy.add(_make_grip(),         name="grip",          color=GRIP_COLOR)
    assy.add(_make_neck(),         name="neck",          color=BODY_COLOR)
    assy.add(_make_scan_head(),    name="scan_head",     color=BODY_COLOR)
    assy.add(_make_head_lip(),     name="head_lip",      color=BODY_COLOR)
    assy.add(_make_scan_window_glass(), name="scan_window",      color=WINDOW_COLOR)
    assy.add(_make_led_insert(),   name="led_indicator",  color=LED_COLOR)
    assy.add(_make_trigger(),      name="trigger",       color=TRIGGER_COLOR)
    assy.add(_make_cable_guard(),  name="cable_guard",   color=RUBBER_COLOR)
    assy.add(_make_cable_tube(),   name="cable_tube",    color=RUBBER_COLOR)
    assy.add(_make_cable_segment(),name="usb_cable",     color=CABLE_COLOR)
    assy.add(_make_brand_logo(),   name="brand_logo",    color=LOGO_COLOR)
    assy.add(_make_bottom_label(), name="bottom_label",  color=LABEL_COLOR)
    assy.add(_make_side_label(),   name="side_label",    color=LABEL_COLOR)

    for idx, screw in enumerate(_make_bottom_screws()):
        assy.add(screw, name=f"bottom_screw_{idx}", color=SCREW_COLOR)

    return assy
