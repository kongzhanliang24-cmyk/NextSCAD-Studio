"""
全局配置：公差、間隙、材質、導出設置等。
所有尺寸單位默認為毫米 (mm)。
"""

# ── 公差與間隙 ──────────────────────────────────────────────
TOL = 0.1          # 一般加工公差
CLEARANCE = 0.2    # 零件裝配間隙
PRESS_FIT = -0.05  # 過盈配合

# ── 緊固件 ────────────────────────────────────────────────────
# 常用螺栓通孔直徑 (mm)，按公稱直徑索引
BOLT_HOLE = {
    "M3":  3.4,
    "M4":  4.5,
    "M5":  5.5,
    "M6":  6.6,
    "M8":  9.0,
    "M10": 11.0,
}

# 沉頭孔直徑 / 深度
COUNTERBORE = {
    "M3":  {"dia": 6.5,  "depth": 3.0},
    "M4":  {"dia": 8.0,  "depth": 4.0},
    "M5":  {"dia": 9.5,  "depth": 5.0},
    "M6":  {"dia": 11.0, "depth": 6.0},
    "M8":  {"dia": 14.5, "depth": 8.0},
    "M10": {"dia": 17.5, "depth": 10.0},
}

# ── 材料密度 (g/cm³) ──────────────────────────────────────────
DENSITY = {
    "PLA":       1.24,
    "ABS":       1.04,
    "PETG":      1.27,
    "Aluminum":  2.70,
    "Steel":     7.85,
    "Brass":     8.50,
    "Nylon":     1.15,
}

# ── 智能秤儀表參數 ────────────────────────────────────────────
# 外殼
INST_W = 270.0              # 寬
INST_H = 180.0              # 高
INST_D = 45.0               # 深
INST_T = 1.5                # 鋼板厚度
INST_FLANGE = 10.0          # 折彎翻邊寬度

# 前邊框與屏幕
BEZEL_W = 15.0              # 前面板邊框寬
SCREEN_W = 240.0            # 屏幕可視區寬
SCREEN_H = 150.0            # 屏幕可視區高
SCREEN_RECESS = 2.0         # 屏幕凹陷深度

# 端口尺寸
USB_W, USB_H = 13.0, 6.0        # USB-A 標準
RJ45_W, RJ45_H = 16.0, 14.0     # RJ45 標準
DB9_W, DB9_H = 31.0, 13.0       # DB9 外殼尺寸
AVIATION_DIA = 16.0             # M16 航空插頭
POWER_JACK_DIA = 12.0           # DIN 電源
SMA_DIA = 6.5                   # SMA 天綫座
AUDIO_DIA = 6.0                 # 3.5mm 耳機孔
SIM_W, SIM_H = 20.0, 2.0        # Nano SIM 卡槽長
SD_W, SD_H = 15.0, 2.0          # microSD/內容卡槽長
POWER_BTN_DIA = 16.0            # 電源按鈕
PINHOLE_DIA = 1.5               # 小圓孔
RESET_BTN_DIA = 3.0             # 凹陷小按鈕

# 天綫
ANTENNA_LEN = 85.0              # 天綫長度
ANTENNA_DIA = 8.0               # 天綫直徑

# ── 導出設置 ──────────────────────────────────────────────────
DEFAULT_EXPORT_FORMAT = "step"        # step | stl | dxf
STL_TOLERANCE = 0.01                  # STL 網格精度
STL_ANGULAR_TOLERANCE = 0.1           # STL 角度精度
