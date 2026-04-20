"""
RS232 DB9 母頭電纜插頭 (Female D-Sub 9-pin Cable Plug) — CadQuery 參數化模型
==========================================================================
參考 image/rs232 interface/ 實體照片：
  - 金屬 D 型屏蔽殼 (D-shell) + 銀色矩形凸緣 (flange)
  - 內部白色絕緣體 + 9 個針孔（母頭，非公頭針腳）
  - 兩側拇指螺絲（鎖固到儀表面板）
  - 黑色塑膠外殼 (backshell) 包覆後端
  - 上蓋兩顆小十字螺絲
  - 不含電纜（前端以 tube curve 渲染）

目的：可插入儀表背面的 RS232 公頭（31 × 13 mm，螺絲間距 34 mm）。
尺寸對齊 src.config.DB9_W (31) × DB9_H (13)，拇指螺絲位於中心 ±17 mm。

坐標系：
  Z 軸：插入方向（D 殼朝 +Z，backshell 朝 -Z）
  Y 軸：長軸（垂直方向，與儀表垂直 DB9 對齊）
  X 軸：短軸（水平）
  Z = 0：凸緣背面（backshell 前端黏合處）

結構（由 -Z 到 +Z）：
  Backshell (-25 → 0)         黑色塑膠外殼
  Flange    (0 → 1.2)         銀色金屬凸緣
  D-Shell   (1.2 → 12.2)      金屬屏蔽梯形管 + 內部絕緣體 + 9 孔
  Thumb screws                從凸緣伸出到 +Z（protruding past D-shell face）
"""

import math

import cadquery as cq


# ══════════════════ 尺寸 (mm) ══════════════════
# D 殼（金屬屏蔽，梯形）
SHELL_W = 13.0                  # 短軸（X，水平）
SHELL_H = 31.0                  # 長軸（Y，垂直）
SHELL_DEPTH = 11.0              # D 殼延伸深度（+Z 方向）
SHELL_WALL = 0.8                # 金屬壁厚
SHELL_TAPER = 2.0               # 梯形單邊收窄量（長邊上窄下寬對應公頭）

# 凸緣（金屬板）
FLANGE_W = 17.0                 # X 寬
FLANGE_H = 37.0                 # Y 高（含螺絲延伸）
FLANGE_T = 1.2                  # 厚度（Z 方向）
FLANGE_FILLET = 1.2             # 外緣倒圓

# 拇指螺絲（兩顆，位於凸緣 Y = ±17）
SCREW_SPACING = 34.0            # 中心間距（= 儀表端螺絲柱間距）
THUMB_SHAFT_DIA = 3.0           # 螺桿
THUMB_SHAFT_PROTRUDE = 3.0      # 螺桿伸出凸緣（+Z 方向）
THUMB_KNOB_DIA = 5.0            # 滾花旋鈕外徑
THUMB_KNOB_H = 2.0              # 旋鈕厚度
THUMB_KNOB_SEGMENTS = 12        # 用 12 邊形模擬滾花

# 絕緣體（白色塑膠，內部填充 D 殼）
INSULATOR_DEPTH = 6.0           # 絕緣體厚度
INSULATOR_RECESS = 3.0          # 從 D 殼前端向 +Z 內縮（讓孔顯得凹陷）
PIN_HOLE_DIA = 1.2              # 9 個針孔徑
PIN_PITCH = 2.76                # DB9 標準針距

# Backshell（黑色塑膠外殼）
BACKSHELL_W = 18.5              # X 寬（略寬於凸緣）
BACKSHELL_H = 38.0              # Y 高（略高於凸緣）
BACKSHELL_DEPTH = 25.0          # Z 深
BACKSHELL_FILLET = 2.0          # 四角倒圓
BACKSHELL_FRONT_TAPER = 0.5     # 前端略窄讓它與凸緣過渡自然

# Backshell 上蓋螺絲（參考「上面.jpg」兩顆十字小螺絲）
TOP_SCREW_DIA = 2.8             # 螺絲頭外徑
TOP_SCREW_HEAD_H = 0.6          # 螺絲頭凸出高度
TOP_SCREW_SLOT_W = 0.4          # 十字槽寬
TOP_SCREW_SLOT_D = 0.2          # 十字槽深
TOP_SCREW_Y = 8.0               # 兩顆螺絲距凸緣（-Z 方向）約 8mm
TOP_SCREW_X_OFFSET = 5.0        # 兩顆螺絲在 X 方向的對稱偏移（Y 為長軸時，螺絲在 X 對稱）

# 電纜出口（backshell 後端的圓凹，不含電纜本體）
CABLE_EXIT_DIA = 6.0
CABLE_EXIT_DEPTH = 1.5          # 凹陷深度

# ══════════════════ 顏色 ══════════════════
SHIELD_COLOR = cq.Color(0.78, 0.78, 0.80, 1.0)       # 亮銀（金屬屏蔽）
FLANGE_COLOR = cq.Color(0.76, 0.76, 0.78, 1.0)       # 略深銀（凸緣）
INSULATOR_COLOR = cq.Color(0.92, 0.90, 0.85, 1.0)    # 米白塑膠
BACKSHELL_COLOR = cq.Color(0.09, 0.09, 0.10, 1.0)    # 深黑塑膠
THUMB_SCREW_COLOR = cq.Color(0.72, 0.72, 0.76, 1.0)  # 銀（拇指螺絲）
TOP_SCREW_COLOR = cq.Color(0.58, 0.58, 0.62, 1.0)    # 深銀（十字小螺絲）


# ═══════════════════════════════════════════════════════════════
#  幾何輔助
# ═══════════════════════════════════════════════════════════════

def _d_trapezoid_points(long_dim: float, short_dim: float, taper: float) -> list:
    """
    D 型梯形點（長軸沿 Y，短軸沿 X）。
    上邊（+Y）較寬，下邊（-Y）較窄（對應儀表端公頭的梯形方向）。

    參數:
        long_dim:  長軸總長（Y 方向，31 mm）
        short_dim: 上邊寬度（X 方向，13 mm）
        taper:     單邊收窄量（下邊比上邊每側少 taper mm）
    """
    half_l = long_dim / 2
    half_s_top = short_dim / 2
    half_s_bot = short_dim / 2 - taper
    # 順時針四點：左上 → 右上 → 右下 → 左下
    return [
        (-half_s_top, half_l),
        (half_s_top, half_l),
        (half_s_bot, -half_l),
        (-half_s_bot, -half_l),
    ]


# ═══════════════════════════════════════════════════════════════
#  零件
# ═══════════════════════════════════════════════════════════════

def _make_d_shell() -> cq.Workplane:
    """
    金屬 D 殼（中空梯形管）。
    外輪廓使用 SHELL_W/SHELL_H，內腔小 2 × SHELL_WALL。
    Z ∈ [FLANGE_T, FLANGE_T + SHELL_DEPTH]
    """
    outer_pts = _d_trapezoid_points(SHELL_H, SHELL_W, SHELL_TAPER)
    inner_short = SHELL_W - 2 * SHELL_WALL
    inner_long = SHELL_H - 2 * SHELL_WALL
    inner_taper = SHELL_TAPER * (inner_short / SHELL_W)  # 按比例縮內腔梯形
    inner_pts = _d_trapezoid_points(inner_long, inner_short, inner_taper)

    outer_solid = (
        cq.Workplane("XY")
        .polyline(outer_pts).close()
        .extrude(SHELL_DEPTH)
    )
    inner_cavity = (
        cq.Workplane("XY")
        .polyline(inner_pts).close()
        .extrude(SHELL_DEPTH + 0.1)  # 略高確保完全貫穿
    )
    shell = outer_solid.cut(inner_cavity)

    # 前緣略倒圓
    try:
        shell = shell.edges(">Z").fillet(0.3)
    except Exception:
        pass

    return shell.translate((0, 0, FLANGE_T))


def _make_flange() -> cq.Workplane:
    """
    金屬凸緣板：矩形板中間挖 D 殼外輪廓（讓 D 殼穿出）。
    Z ∈ [0, FLANGE_T]
    """
    plate = (
        cq.Workplane("XY")
        .rect(FLANGE_W, FLANGE_H)
        .extrude(FLANGE_T)
    )
    # 四角倒圓
    try:
        plate = plate.edges("|Z").fillet(FLANGE_FILLET)
    except Exception:
        pass

    # 挖 D 殼通孔（與 D 殼外輪廓一致，讓殼體穿過）
    d_hole = (
        cq.Workplane("XY")
        .polyline(_d_trapezoid_points(SHELL_H, SHELL_W, SHELL_TAPER)).close()
        .extrude(FLANGE_T + 0.2)
        .translate((0, 0, -0.1))
    )
    plate = plate.cut(d_hole)

    # 挖兩顆拇指螺絲孔（允許螺桿穿過）
    for sy in (-SCREW_SPACING / 2, SCREW_SPACING / 2):
        shaft_hole = (
            cq.Workplane("XY")
            .circle(THUMB_SHAFT_DIA / 2 + 0.05)
            .extrude(FLANGE_T + 0.2)
            .translate((0, sy, -0.1))
        )
        plate = plate.cut(shaft_hole)

    return plate


def _make_insulator() -> cq.Workplane:
    """
    白色絕緣體：填充 D 殼內部（略小於 D 殼內腔），開 9 個針孔。
    Z ∈ [FLANGE_T + INSULATOR_RECESS, FLANGE_T + INSULATOR_RECESS + INSULATOR_DEPTH]
    """
    inner_short = SHELL_W - 2 * SHELL_WALL - 0.2
    inner_long = SHELL_H - 2 * SHELL_WALL - 0.2
    inner_taper = SHELL_TAPER * (inner_short / SHELL_W)
    pts = _d_trapezoid_points(inner_long, inner_short, inner_taper)

    body = (
        cq.Workplane("XY")
        .polyline(pts).close()
        .extrude(INSULATOR_DEPTH)
        .translate((0, 0, FLANGE_T + INSULATOR_RECESS))
    )

    # 9 個針孔：2 排（上 5 下 4），長軸方向垂直（Y 軸）
    # 在 DB9 垂直放置時，針腳排佈為：
    #   上排 5 孔沿 X = -2P ~ +2P，位於 Y = +P/2
    #   下排 4 孔沿 X = -1.5P ~ +1.5P，位於 Y = -P/2
    # （這裡長軸是 Y，但孔陣列跨的仍是 X 方向短距離）
    # 不過因為 DB9 的 9 孔分布實際是沿「寬邊」延伸的，當殼體旋轉 90° 時，
    # 孔陣列也要相應旋轉：孔沿 Y 方向延伸，兩排在 X 方向分開。
    holes = cq.Workplane("XY")
    for i in range(5):
        # 上排（X 正側）
        hy = -PIN_PITCH * 2 + i * PIN_PITCH
        hx = PIN_PITCH * 0.5
        holes = holes.union(
            cq.Workplane("XY")
            .circle(PIN_HOLE_DIA / 2)
            .extrude(INSULATOR_DEPTH * 0.6)
            .translate((hx, hy, FLANGE_T + INSULATOR_RECESS - 0.05))
        )
    for i in range(4):
        # 下排（X 負側）
        hy = -PIN_PITCH * 1.5 + i * PIN_PITCH
        hx = -PIN_PITCH * 0.5
        holes = holes.union(
            cq.Workplane("XY")
            .circle(PIN_HOLE_DIA / 2)
            .extrude(INSULATOR_DEPTH * 0.6)
            .translate((hx, hy, FLANGE_T + INSULATOR_RECESS - 0.05))
        )
    body = body.cut(holes)

    return body


def _make_thumb_screws() -> cq.Workplane:
    """
    兩顆拇指螺絲：螺桿從凸緣後方穿過凸緣，螺桿前端凸出 D 殼面板方向（+Z）；
    滾花旋鈕位於凸緣 +Z 面（貼著凸緣前端），以 12 邊形模擬滾花。
    """
    screws = cq.Workplane("XY")
    for sy in (-SCREW_SPACING / 2, SCREW_SPACING / 2):
        # 滾花旋鈕（12 邊形模擬滾花表面）
        knob = (
            cq.Workplane("XY")
            .polygon(THUMB_KNOB_SEGMENTS, THUMB_KNOB_DIA)
            .extrude(THUMB_KNOB_H)
            .translate((0, sy, FLANGE_T))
        )
        # 前端螺桿（+Z 凸出）
        shaft = (
            cq.Workplane("XY")
            .circle(THUMB_SHAFT_DIA / 2)
            .extrude(THUMB_KNOB_H + THUMB_SHAFT_PROTRUDE)
            .translate((0, sy, FLANGE_T))
        )
        # 後端螺桿（-Z 穿入 backshell，短截）
        back_shaft = (
            cq.Workplane("XY")
            .circle(THUMB_SHAFT_DIA / 2)
            .extrude(-2.0)
            .translate((0, sy, FLANGE_T))
        )
        screws = screws.union(knob).union(shaft).union(back_shaft)

    return screws


def _make_backshell() -> cq.Workplane:
    """
    黑色塑膠外殼：從凸緣後方（-Z）延伸 BACKSHELL_DEPTH。
    四角倒圓，後端電纜出口淺凹。
    Z ∈ [-BACKSHELL_DEPTH, 0]
    """
    box = (
        cq.Workplane("XY")
        .rect(BACKSHELL_W, BACKSHELL_H)
        .extrude(-BACKSHELL_DEPTH)
    )
    try:
        box = box.edges("|Z").fillet(BACKSHELL_FILLET)
    except Exception:
        pass
    # 前後 Z 邊倒圓讓前端更貼合凸緣、後端更柔和
    try:
        box = box.edges("<Z").fillet(1.5)
    except Exception:
        pass

    # 電纜出口圓凹（後端中心）
    cable_recess = (
        cq.Workplane("XY")
        .circle(CABLE_EXIT_DIA / 2)
        .extrude(CABLE_EXIT_DEPTH)
        .translate((0, 0, -BACKSHELL_DEPTH - 0.01))
    )
    box = box.cut(cable_recess)

    # 上蓋兩顆十字螺絲孔（用 TOP_SCREW_HEAD 做凹陷，螺絲本身另外建）
    # 這裡只做螺絲頭稍微凹入 backshell 表面（沿 +X 面）
    return box


def _make_top_screws() -> cq.Workplane:
    """
    Backshell 上蓋兩顆十字小螺絲（參考「上面.jpg」）。
    位於 backshell +X 面（假設安裝時 +X 朝上），距凸緣 TOP_SCREW_Y（-Z 方向），
    沿 Y 軸對稱分布於 ±TOP_SCREW_X_OFFSET。

    注意：以 Y 為長軸的 DB9 中，「上面」即 backshell +X 面或 +Y 面，
    兩顆螺絲在 Y 方向對稱（因為 Y 是長軸，有足夠空間），X 為螺絲頭凸出方向。
    """
    screws = cq.Workplane("XY")
    # 螺絲位置：+X 面上的兩個點
    x_face = BACKSHELL_W / 2  # 螺絲頭附著於 backshell +X 面
    for sy in (-TOP_SCREW_X_OFFSET, TOP_SCREW_X_OFFSET):
        sz = -TOP_SCREW_Y  # 距凸緣 8mm（向 -Z 方向）
        # 螺絲頭（短圓柱，沿 +X 方向）
        head = (
            cq.Workplane("YZ")
            .circle(TOP_SCREW_DIA / 2)
            .extrude(TOP_SCREW_HEAD_H)
            .translate((x_face, sy, sz))
        )
        # 十字槽（兩條垂直淺槽切頭）
        slot1 = (
            cq.Workplane("YZ")
            .rect(TOP_SCREW_DIA * 0.85, TOP_SCREW_SLOT_W)
            .extrude(TOP_SCREW_SLOT_D)
            .translate((x_face + TOP_SCREW_HEAD_H - TOP_SCREW_SLOT_D, sy, sz))
        )
        slot2 = (
            cq.Workplane("YZ")
            .rect(TOP_SCREW_SLOT_W, TOP_SCREW_DIA * 0.85)
            .extrude(TOP_SCREW_SLOT_D)
            .translate((x_face + TOP_SCREW_HEAD_H - TOP_SCREW_SLOT_D, sy, sz))
        )
        head = head.cut(slot1).cut(slot2)
        screws = screws.union(head)

    return screws


# ═══════════════════════════════════════════════════════════════
#  裝配
# ═══════════════════════════════════════════════════════════════

def make_rs232_plug() -> cq.Assembly:
    """
    組裝 RS232 DB9 母頭電纜插頭。
    返回 cq.Assembly，每個零件帶獨立顏色，可直接 .export('...glb', exportType='GLTF')。

    坐標系：
        +Z = 插入方向（D 殼朝向儀表）
        +Y = 長軸（垂直方向）
    """
    assy = cq.Assembly(name="rs232_plug")

    # 金屬屏蔽與凸緣（同系銀色）
    assy.add(_make_d_shell(),       name="d_shell",    color=SHIELD_COLOR)
    assy.add(_make_flange(),        name="flange",     color=FLANGE_COLOR)

    # 白色絕緣體（內嵌於 D 殼）
    assy.add(_make_insulator(),     name="insulator",  color=INSULATOR_COLOR)

    # 兩顆拇指螺絲
    assy.add(_make_thumb_screws(),  name="thumb_screws", color=THUMB_SCREW_COLOR)

    # 黑色 backshell
    assy.add(_make_backshell(),     name="backshell",  color=BACKSHELL_COLOR)

    # Backshell 上蓋兩顆十字小螺絲
    assy.add(_make_top_screws(),    name="top_screws", color=TOP_SCREW_COLOR)

    return assy
