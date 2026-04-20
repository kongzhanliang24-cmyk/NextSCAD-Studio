"""
工业级 USB 迷你摄像头 – CadQuery 参数化模型
=============================================
参考 image/camera/ 全部 7 张实物照片 + 用户确认的尺寸重构。

用户确认规格：
  壳体: 40×40×30 mm (W×H×D)
  镜头: 明显凸出的短圆柱 (5-7mm 高)
  背面: 六角螺母形护套 + 线缆中心穿出
  线缆: 向后延伸后自然下垂（真实布线效果）

坐标约定：
  X = 宽 (左负右正)  Y = 深 (前负后正)  Z = 高 (下负上正)
"""

import cadquery as cq

# ══════════════════ 尺寸参数 ══════════════════
# 壳体：梯形结构，后大前小，相差 5mm（用户确认）
BODY_FRONT_W = 40.0   # 前脸宽
BODY_FRONT_H = 40.0   # 前脸高
BODY_BACK_W  = 50.0   # 后脸宽（比前面大 10mm）
BODY_BACK_H  = 50.0   # 后脸高
BODY_D       = 30.0   # 深度

# 前面凸出的圆柱镜头筒
BARREL_R     = 14.0   # 圆柱半径
BARREL_H     = 6.0    # 凸出高度
BARREL_INSET = 1.0    # 嵌入壳体深度

# 筒前端的浅镜头窝（凹入筒内）
LENS_WELL_R      = 10.0  # 镜头窝半径
LENS_WELL_DEPTH  = 2.0   # 镜头窝深度

# 镜头窝底中心的方形镜片座
LENS_MOUNT_SIZE  = 6.0   # 方座边长
LENS_MOUNT_H     = 1.2   # 方座凸出窝底的高度

# 方座中心的银色金属镜头（看起来像六角螺钉）
LENS_METAL_R     = 2.2   # 金属六角外接圆半径
LENS_METAL_H     = 0.8   # 金属凸出高度
LENS_GLASS_R     = 1.0   # 中心玻璃镜片半径
LENS_GLASS_H     = 0.3   # 镜片凸出高度

# 背面 4 角螺丝
SCREW_R     = 1.3
SCREW_HEAD  = 0.5
SCREW_INSET = 4.5

# 侧面 2 颗小螺丝
SIDE_SCREW_R = 1.0

# 背面六角螺母形护套
HEX_CIRCUMS_R = 5.5    # 六角外接圆半径（≈flat2flat 9.5mm）
HEX_THICK     = 3.0    # 护套厚度（凸出背面）

# 线缆
CABLE_R        = 1.8
CABLE_BACK_LEN = 18.0   # 向后直线段
CABLE_DOWN_LEN = 32.0   # 下垂段
CABLE_Z        = -3.0    # 出线孔 Z 坐标（略偏下）

# ══════════════════ 颜色 ══════════════════
# 现实参考：机身是炭灰塑料（不是纯黑），镜头区更深，金属件高亮
BODY_COLOR    = cq.Color(0.28, 0.28, 0.30, 1.0)   # 炭灰壳体（主色，明显比纯黑亮）
BARREL_COLOR  = cq.Color(0.22, 0.22, 0.24, 1.0)   # 镜头筒（比机身略深）
MOUNT_COLOR   = cq.Color(0.12, 0.12, 0.13, 1.0)   # 方座（深黑塑料）
METAL_COLOR   = cq.Color(0.85, 0.85, 0.88, 1.0)   # 银色金属环（更亮突出）
LENS_COLOR    = cq.Color(0.08, 0.12, 0.20, 0.85)  # 玻璃镜片（略带蓝反光）
SCREW_COLOR   = cq.Color(0.72, 0.72, 0.76, 1.0)   # 银色螺丝
HEX_COLOR     = cq.Color(0.15, 0.15, 0.17, 1.0)   # 六角护套
CABLE_COLOR   = cq.Color(0.18, 0.18, 0.20, 1.0)   # 线缆（深灰，非纯黑）
LABEL_COLOR   = cq.Color(0.92, 0.92, 0.86, 1.0)   # QC 贴纸（乳白）


# ─────────────────── 壳体（梯形） ───────────────────
def _make_body() -> cq.Workplane:
    """梯形壳体：前脸小、后脸大。"""
    body = (
        cq.Workplane("XY")
        .rect(BODY_FRONT_W, BODY_FRONT_H)
        .workplane(offset=BODY_D)
        .rect(BODY_BACK_W, BODY_BACK_H)
        .loft(combine=True)
    )
    body = body.rotate((0, 0, 0), (1, 0, 0), -90)
    body = body.translate((0, -BODY_D / 2, 0))
    return body


# ─────────────────── 前面凸出镜头筒（带前端浅窝） ───────────────────
def _make_lens_barrel() -> cq.Workplane:
    """前脸凸出的圆柱镜头筒，前端有浅镜头窝。"""
    total_len = BARREL_H + BARREL_INSET
    # 在 XZ 平面创建圆柱，沿 -Y 方向挤出（朝前）
    barrel = (
        cq.Workplane("XZ")
        .circle(BARREL_R)
        .extrude(total_len)                    # Y=0 → Y=-total_len
    )
    # 前端边缘倒圆
    barrel = barrel.faces("<Y").edges().fillet(0.6)
    # 前端浅窝：从 Y=-total_len 向内凹 LENS_WELL_DEPTH
    well = (
        cq.Workplane("XZ")
        .circle(LENS_WELL_R)
        .extrude(LENS_WELL_DEPTH + 0.05)       # 略深保证切干净
        .translate((0, -(total_len - LENS_WELL_DEPTH) + 0.05, 0))
    )
    barrel = barrel.cut(well)
    # 平移：筒后端嵌入壳体 1mm，即后端世界 Y = -BODY_D/2 + BARREL_INSET
    back_y = -BODY_D / 2 + BARREL_INSET
    barrel = barrel.translate((0, back_y, 0))
    return barrel


# ─────────────────── 方形镜片座 ───────────────────
def _make_lens_mount() -> cq.Workplane:
    """镜头窝底部中心的方形镜片座（深黑塑料）。"""
    # 筒前端世界坐标 Y_tip = -BODY_D/2 + BARREL_INSET - (BARREL_H + BARREL_INSET) = -BODY_D/2 - BARREL_H
    barrel_tip_y = -BODY_D / 2 - BARREL_H
    well_floor_y = barrel_tip_y + LENS_WELL_DEPTH
    mount = (
        cq.Workplane("XZ")
        .rect(LENS_MOUNT_SIZE, LENS_MOUNT_SIZE)
        .extrude(LENS_MOUNT_H)                 # Y=0 → Y=-LENS_MOUNT_H
        .edges("|Y").fillet(0.3)
        .translate((0, well_floor_y, 0))
    )
    return mount


# ─────────────────── 银色金属镜头环（六角） ───────────────────
def _make_lens_metal() -> cq.Workplane:
    """方形镜片座上的银色金属六角（像小螺钉）。"""
    barrel_tip_y = -BODY_D / 2 - BARREL_H
    well_floor_y = barrel_tip_y + LENS_WELL_DEPTH
    mount_front_y = well_floor_y - LENS_MOUNT_H
    metal = (
        cq.Workplane("XZ")
        .polygon(6, LENS_METAL_R * 2)
        .extrude(LENS_METAL_H)
        .translate((0, mount_front_y, 0))
    )
    return metal


# ─────────────────── 中心玻璃镜片 ───────────────────
def _make_lens_glass() -> cq.Workplane:
    """银色金属中心的小玻璃镜片。"""
    barrel_tip_y = -BODY_D / 2 - BARREL_H
    well_floor_y = barrel_tip_y + LENS_WELL_DEPTH
    metal_front_y = well_floor_y - LENS_MOUNT_H - LENS_METAL_H
    glass = (
        cq.Workplane("XZ")
        .circle(LENS_GLASS_R)
        .extrude(LENS_GLASS_H)
        .translate((0, metal_front_y, 0))
    )
    return glass


# ─────────────────── 背面 4 角螺丝 ───────────────────
def _make_back_screws() -> list:
    """背面四角各一颗银色螺丝头（贴合后脸的大尺寸）。"""
    back_y = BODY_D / 2
    screws = []
    for sx, sz in [(-1, -1), (1, -1), (-1, 1), (1, 1)]:
        x = sx * (BODY_BACK_W / 2 - SCREW_INSET)
        z = sz * (BODY_BACK_H / 2 - SCREW_INSET)
        s = (
            cq.Workplane("XZ")
            .circle(SCREW_R)
            .extrude(SCREW_HEAD)
            .translate((x, back_y, z))
        )
        screws.append(s)
    return screws


# ─────────────────── 侧面螺丝 ───────────────────
def _make_side_screws() -> list:
    """左侧面两颗小螺丝（位于梯形侧面中部，略偏前）。"""
    screws = []
    # 侧面在前后之间线性变化；取中点的左侧表面 X 值作为参考
    lx_mid = -((BODY_FRONT_W + BODY_BACK_W) / 4)
    for z_off in [-8.0, 8.0]:
        s = (
            cq.Workplane("YZ")
            .circle(SIDE_SCREW_R)
            .extrude(0.4)
            .translate((lx_mid - 0.4, 0, z_off))
        )
        screws.append(s)
    return screws


# ─────────────────── 六角螺母形护套 ───────────────────
def _make_hex_grommet() -> cq.Workplane:
    """背面中央偏下的六角螺母形出线护套。向 +Y 方向凸出背面。"""
    back_y = BODY_D / 2
    # XY 平面构建六角 + 圆孔，沿 +Z 挤出（清晰方向）
    outer = (
        cq.Workplane("XY")
        .polygon(6, HEX_CIRCUMS_R * 2)
        .extrude(HEX_THICK)
    )
    hole = (
        cq.Workplane("XY")
        .circle(CABLE_R + 0.2)
        .extrude(HEX_THICK + 0.2)
    )
    grommet = outer.cut(hole)
    # 绕 +X 轴 +90°：+Z → -Y，即正向朝前；我们要 +Y，因此用 -90°
    grommet = grommet.rotate((0, 0, 0), (1, 0, 0), -90)
    # 此时后端位于世界 Y=0，前端位于世界 Y=+HEX_THICK
    # 平移到背面外侧：后端贴后脸 Y=BODY_D/2
    grommet = grommet.translate((0, back_y, CABLE_Z))
    return grommet


# ─────────────────── USB 线缆（后延伸 + 自然下垂）───────────────────
def _make_cable() -> cq.Workplane:
    """线缆：从六角护套向后直线段 + 肘部球形过渡 + 向下垂段。"""
    # 线缆从护套外端穿出
    exit_y = BODY_D / 2 + HEX_THICK
    # 水平向后段（沿 +Y 方向延伸）
    horiz = (
        cq.Workplane("XY")
        .circle(CABLE_R)
        .extrude(CABLE_BACK_LEN)
    )
    # 旋转使其沿 +Y：绕 +X 轴 -90°（+Z → +Y）
    horiz = horiz.rotate((0, 0, 0), (1, 0, 0), -90)
    # 此时水平段从 Y=0 到 Y=+CABLE_BACK_LEN
    horiz = horiz.translate((0, exit_y, CABLE_Z))
    # 肘部位置（水平段末端）
    elbow_y = exit_y + CABLE_BACK_LEN
    elbow_z = CABLE_Z
    # 球形接头
    elbow = cq.Workplane("XY").sphere(CABLE_R).translate((0, elbow_y, elbow_z))
    # 垂直向下段（沿 -Z）
    vert = (
        cq.Workplane("XY")
        .circle(CABLE_R)
        .extrude(-CABLE_DOWN_LEN)
        .translate((0, elbow_y, elbow_z))
    )
    return horiz.union(elbow).union(vert)


# ─────────────────── QC 贴纸 ───────────────────
def _make_qc_label() -> cq.Workplane:
    """背面左上方 QC PASSED 圆形贴纸。"""
    back_y = BODY_D / 2
    return (
        cq.Workplane("XZ")
        .circle(4.0)
        .extrude(0.2)
        .translate((-9.0, back_y, 10.0))
    )


# ═══════════════════ 组装 ═══════════════════
def make_usb_camera() -> cq.Assembly:
    assy = cq.Assembly(name="usb_camera")

    assy.add(_make_body(),        name="body",        color=BODY_COLOR)
    assy.add(_make_lens_barrel(), name="lens_barrel", color=BARREL_COLOR)
    assy.add(_make_lens_mount(),  name="lens_mount",  color=MOUNT_COLOR)
    assy.add(_make_lens_metal(),  name="lens_metal",  color=METAL_COLOR)
    assy.add(_make_lens_glass(),  name="lens_glass",  color=LENS_COLOR)
    assy.add(_make_hex_grommet(), name="hex_grommet", color=HEX_COLOR)
    assy.add(_make_cable(),       name="usb_cable",   color=CABLE_COLOR)
    assy.add(_make_qc_label(),    name="qc_label",    color=LABEL_COLOR)

    for i, s in enumerate(_make_back_screws()):
        assy.add(s, name=f"back_screw_{i}", color=SCREW_COLOR)

    for i, s in enumerate(_make_side_screws()):
        assy.add(s, name=f"side_screw_{i}", color=SCREW_COLOR)

    return assy
