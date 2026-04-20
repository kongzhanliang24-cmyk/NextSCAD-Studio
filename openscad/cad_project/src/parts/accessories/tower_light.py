"""
工業級三色塔燈 (LED Tower / Stack Light) — CadQuery 參數化模型
================================================================
參考 image/gpio/ 實體照片 + 用戶確認尺寸：
  燈管/柱身直徑  60 mm
  底座法蘭直徑   80 mm
  每層燈罩高     60 mm
  圓柱總高       300 mm  (法蘭頂面 → 頂蓋頂)
  燈罩使用純色半透明（不建垂直稜紋幾何，保持檔案精簡）
  不包含電纜

結構（從底到頂）：
  Flange (-6 → 0)          圓盤 80 × 6，下方三個保護凸環 + 三個 M5 安裝孔
  Collar (0 → 4)           錐形過渡 80 → 60 mm
  Lower smooth (4 → 31)    光滑圓柱段（標籤區，27 mm）
  Lower ribbed (31 → 91)   散熱溝槽段（60 mm，8 條橫向溝）
  Silver ring (91 → 94)    銀色分隔環
  Yellow dome (94 → 154)   黃/橙透明燈罩 60 mm
  Silver ring (154 → 157)
  Green dome (157 → 217)
  Silver ring (217 → 220)
  Red dome (220 → 280)
  Top cap (280 → 300)      白色頂蓋 + 中心螺絲 20 mm

坐標系：
  Z 軸向上，塔燈中心線為 Z 軸
  Z = 0 位於底座法蘭頂面
  法蘭本體位於 Z ∈ [-FLANGE_H, 0]，塔身從 Z = 0 延伸至 Z = 300
"""

import math

import cadquery as cq


# ══════════════════ 尺寸 (mm) ══════════════════
# 底座法蘭
FLANGE_DIA = 80.0
FLANGE_H = 6.0
FLANGE_BOTTOM_FILLET = 1.5      # 底部外緣倒圓
FLANGE_TOP_FILLET = 1.0         # 頂部外緣略倒圓

# 安裝孔（3 個 M5，120° 等分）
MOUNT_HOLE_DIA = 5.5
MOUNT_HOLE_RADIUS = 28.0        # 距中心距離
BOSS_OD = 13.0                  # 法蘭底面保護凸環外徑
BOSS_H = 2.5                    # 凸環凸出高度
BOSS_FILLET = 0.8

# 錐形過渡（法蘭 → 柱身）
COLLAR_H = 4.0
POST_DIA = 60.0

# 下殼段（從法蘭頂 → 第一銀環）
LOWER_SMOOTH_H = 27.0           # 光滑段（標籤區）
LOWER_RIBBED_H = 60.0           # 散熱溝槽段

# 散熱溝槽
RIB_COUNT = 8                   # 溝槽數
RIB_DEPTH = 0.9                 # 溝槽徑向深度
RIB_HEIGHT = 1.6                # 每條溝槽軸向高度

# 銀色分隔環
RING_H = 3.0
RING_OD = POST_DIA + 1.0        # 略凸出於柱身（61 mm）

# 燈罩
DOME_H = 60.0
DOME_DIA = POST_DIA             # 與柱身同徑 60 mm

# 頂蓋
TOP_CAP_H = 20.0
TOP_CAP_MAX_DIA = POST_DIA + 4.0  # 略凸出 64 mm
TOP_CAP_FILLET = 4.0              # 頂部圓角（形成柔和的圓頂感）

# 中心螺絲（頂部可見的 Phillips 螺絲頭）
TOP_SCREW_DIA = 5.0
TOP_SCREW_H = 1.2
TOP_SCREW_SLOT_W = 0.6          # 十字槽寬
TOP_SCREW_SLOT_D = 0.4          # 十字槽深

# ══════════════════ 高度累加（Z 座標）══════════════════
Z_COLLAR_TOP = COLLAR_H                                     # 4
Z_SMOOTH_TOP = Z_COLLAR_TOP + LOWER_SMOOTH_H                # 31
Z_RIBBED_TOP = Z_SMOOTH_TOP + LOWER_RIBBED_H                # 91
Z_RING1_BOT = Z_RIBBED_TOP                                  # 91
Z_RING1_TOP = Z_RING1_BOT + RING_H                          # 94
Z_DOME_YELLOW_TOP = Z_RING1_TOP + DOME_H                    # 154
Z_RING2_TOP = Z_DOME_YELLOW_TOP + RING_H                    # 157
Z_DOME_GREEN_TOP = Z_RING2_TOP + DOME_H                     # 217
Z_RING3_TOP = Z_DOME_GREEN_TOP + RING_H                     # 220
Z_DOME_RED_TOP = Z_RING3_TOP + DOME_H                       # 280
Z_TOP = Z_DOME_RED_TOP + TOP_CAP_H                          # 300

# ══════════════════ 顏色 ══════════════════
# 主體灰白塑料（照片呈現略帶米色的淺灰）
BODY_COLOR = cq.Color(0.86, 0.86, 0.84, 1.0)
# 頂蓋略偏白
CAP_COLOR = cq.Color(0.90, 0.90, 0.88, 1.0)
# 銀色分隔環（拋光金屬亮銀）
RING_COLOR = cq.Color(0.78, 0.78, 0.80, 1.0)
# 頂部螺絲（較深銀色）
SCREW_COLOR = cq.Color(0.62, 0.62, 0.66, 1.0)
# 透明彩色燈罩（alpha 0.5 讓三色更通透）
DOME_YELLOW = cq.Color(1.0, 0.62, 0.05, 0.55)
DOME_GREEN = cq.Color(0.05, 0.78, 0.20, 0.55)
DOME_RED = cq.Color(0.95, 0.12, 0.08, 0.55)


# ═══════════════════════════════════════════════════════════════
#  零件構建函數
# ═══════════════════════════════════════════════════════════════

def _make_flange() -> cq.Workplane:
    """底座法蘭：圓盤 + 3 個底部保護凸環 + 3 個 M5 安裝孔。"""
    # 主圓盤：Z ∈ [-FLANGE_H, 0]
    disc = (
        cq.Workplane("XY")
        .circle(FLANGE_DIA / 2)
        .extrude(FLANGE_H)
        .translate((0, 0, -FLANGE_H))
    )
    # 底部外緣倒圓（看起來更厚實工業）
    try:
        disc = disc.edges("<Z").fillet(FLANGE_BOTTOM_FILLET)
    except Exception:
        pass
    # 頂部外緣略倒圓
    try:
        disc = disc.edges(">Z and %CIRCLE").fillet(FLANGE_TOP_FILLET)
    except Exception:
        pass

    # 3 個底部凸環（起到腳墊作用）+ 3 個穿孔
    bosses = None
    holes = None
    for i in range(3):
        ang = math.radians(i * 120)  # 0°, 120°, 240°
        bx = MOUNT_HOLE_RADIUS * math.cos(ang)
        by = MOUNT_HOLE_RADIUS * math.sin(ang)

        boss = (
            cq.Workplane("XY")
            .circle(BOSS_OD / 2)
            .extrude(-BOSS_H)  # 向下凸出於法蘭底面
            .translate((bx, by, -FLANGE_H))
        )
        try:
            boss = boss.edges("<Z").fillet(BOSS_FILLET)
        except Exception:
            pass
        bosses = boss if bosses is None else bosses.union(boss)

        # 貫穿孔（穿過凸環 + 法蘭）
        hole = (
            cq.Workplane("XY")
            .circle(MOUNT_HOLE_DIA / 2)
            .extrude(FLANGE_H + BOSS_H + 1.0)
            .translate((bx, by, -FLANGE_H - BOSS_H - 0.5))
        )
        holes = hole if holes is None else holes.union(hole)

    flange = disc.union(bosses).cut(holes)
    return flange


def _make_lower_body() -> cq.Workplane:
    """
    下殼一體件：錐形過渡 + 光滑段 + 散熱溝槽段。
    用三段圓柱 + 溝槽 cut 實現，避免 revolve 的 axis 設定困擾。
    """
    # 錐形過渡：loft 從 80 mm → 60 mm，高度 COLLAR_H
    collar = (
        cq.Workplane("XY")
        .circle(FLANGE_DIA / 2)
        .workplane(offset=COLLAR_H)
        .circle(POST_DIA / 2)
        .loft(combine=True)
    )

    # 光滑圓柱段
    smooth = (
        cq.Workplane("XY")
        .circle(POST_DIA / 2)
        .extrude(LOWER_SMOOTH_H)
        .translate((0, 0, Z_COLLAR_TOP))
    )

    # 散熱溝槽段：先做滿柱體，再 cut 掉 n 條環狀溝槽
    ribbed = (
        cq.Workplane("XY")
        .circle(POST_DIA / 2)
        .extrude(LOWER_RIBBED_H)
        .translate((0, 0, Z_SMOOTH_TOP))
    )

    # 溝槽均勻分佈：兩端各留 flat_pad，中間 RIB_COUNT 條
    if RIB_COUNT > 0:
        total_rib_h = RIB_COUNT * RIB_HEIGHT
        gaps = RIB_COUNT + 1  # n 條溝槽之間有 n+1 個平段
        flat_pad = (LOWER_RIBBED_H - total_rib_h) / gaps

        groove_outer = POST_DIA / 2 + 1.0      # 保證切到外表面
        groove_inner = POST_DIA / 2 - RIB_DEPTH

        for i in range(RIB_COUNT):
            # 溝槽中心 Z（世界座標）
            z_groove_bot = Z_SMOOTH_TOP + flat_pad + i * (RIB_HEIGHT + flat_pad)
            ring_cutter = (
                cq.Workplane("XY")
                .circle(groove_outer)
                .circle(groove_inner)
                .extrude(RIB_HEIGHT)
                .translate((0, 0, z_groove_bot))
            )
            ribbed = ribbed.cut(ring_cutter)

    body = collar.union(smooth).union(ribbed)
    return body


def _make_separator_ring(z_bottom: float) -> cq.Workplane:
    """銀色分隔環：略大於柱身的薄圓盤。"""
    return (
        cq.Workplane("XY")
        .circle(RING_OD / 2)
        .extrude(RING_H)
        .translate((0, 0, z_bottom))
    )


def _make_dome(z_bottom: float) -> cq.Workplane:
    """透明彩色燈罩：簡單圓柱（純色透明，不建垂直稜紋）。"""
    return (
        cq.Workplane("XY")
        .circle(DOME_DIA / 2)
        .extrude(DOME_H)
        .translate((0, 0, z_bottom))
    )


def _make_top_cap(z_bottom: float) -> cq.Workplane:
    """
    白色頂蓋：略凸出於紅燈罩的圓盤 + 頂部圓角。
    底部小台階與紅燈罩接合（視覺上有一條小銀縫）。
    """
    cap = (
        cq.Workplane("XY")
        .circle(TOP_CAP_MAX_DIA / 2)
        .extrude(TOP_CAP_H)
        .translate((0, 0, z_bottom))
    )
    # 頂部外緣圓角 → 柔和圓頂感
    try:
        cap = cap.edges(">Z").fillet(TOP_CAP_FILLET)
    except Exception:
        pass
    # 底部外緣略倒圓（避免鋒利邊）
    try:
        cap = cap.edges("<Z").fillet(0.5)
    except Exception:
        pass
    return cap


def _make_top_screw(z_bottom: float) -> cq.Workplane:
    """頂部中心螺絲頭：銀色圓盤 + 十字槽。"""
    head = (
        cq.Workplane("XY")
        .circle(TOP_SCREW_DIA / 2)
        .extrude(TOP_SCREW_H)
        .translate((0, 0, z_bottom))
    )
    # 十字槽（兩條垂直矩形淺槽）
    slot1 = (
        cq.Workplane("XY")
        .rect(TOP_SCREW_DIA * 0.85, TOP_SCREW_SLOT_W)
        .extrude(TOP_SCREW_SLOT_D)
        .translate((0, 0, z_bottom + TOP_SCREW_H - TOP_SCREW_SLOT_D))
    )
    slot2 = (
        cq.Workplane("XY")
        .rect(TOP_SCREW_SLOT_W, TOP_SCREW_DIA * 0.85)
        .extrude(TOP_SCREW_SLOT_D)
        .translate((0, 0, z_bottom + TOP_SCREW_H - TOP_SCREW_SLOT_D))
    )
    head = head.cut(slot1).cut(slot2)
    return head


# ═══════════════════════════════════════════════════════════════
#  裝配
# ═══════════════════════════════════════════════════════════════

def make_tower_light() -> cq.Assembly:
    """
    組裝完整三色塔燈。
    返回 cq.Assembly，每個零件帶顏色，可直接 .export('...glb', exportType='GLTF')。
    """
    assy = cq.Assembly(name="tower_light")

    # 底座 + 下殼（同色白灰塑料）
    assy.add(_make_flange(),     name="flange",      color=BODY_COLOR)
    assy.add(_make_lower_body(), name="lower_body",  color=BODY_COLOR)

    # 三個銀色分隔環
    assy.add(_make_separator_ring(Z_RING1_BOT),
             name="ring_bottom", color=RING_COLOR)
    assy.add(_make_separator_ring(Z_DOME_YELLOW_TOP),
             name="ring_middle", color=RING_COLOR)
    assy.add(_make_separator_ring(Z_DOME_GREEN_TOP),
             name="ring_upper",  color=RING_COLOR)

    # 三個燈罩（底→頂：黃、綠、紅）
    assy.add(_make_dome(Z_RING1_TOP),  name="dome_yellow", color=DOME_YELLOW)
    assy.add(_make_dome(Z_RING2_TOP),  name="dome_green",  color=DOME_GREEN)
    assy.add(_make_dome(Z_RING3_TOP),  name="dome_red",    color=DOME_RED)

    # 頂蓋 + 中心螺絲
    assy.add(_make_top_cap(Z_DOME_RED_TOP),
             name="top_cap",   color=CAP_COLOR)
    assy.add(_make_top_screw(Z_TOP),
             name="top_screw", color=SCREW_COLOR)

    return assy
