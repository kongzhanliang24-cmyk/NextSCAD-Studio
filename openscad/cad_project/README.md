# NextSCAD Studio — 智能秤儀表 CAD 項目

基於 [CadQuery](https://github.com/CadQuery/cadquery) 的參數化 3D 建模項目，專為 **NextSCAD Studio** 智能秤儀表及其配件建模。所有零件以 Python 代碼定義，可在 [cq-editor](https://github.com/CadQuery/CQ-editor) 中即時預覽，並可一鍵導出 **GLB** 格式供前端 Three.js / WebGL 場景（`weighting_new`）使用。

## 特性

- **純 Python 參數化建模** — 所有尺寸集中於 `src/config.py`，改一處即可批量更新
- **模塊化零件庫** — 主體儀表 + 可熱拔插的 USB 配件（打印機、掃碼槍、攝像頭、U 盤）
- **屏幕貼圖自動化** — 將 app 截圖自動套用到 GLB 模型的顯示屏 mesh
- **直出 Web 前端目錄** — GLB 自動輸出至 `weighting_new/public/models/`，前端無需手動複製
- **pytest 單元測試** — 保證零件幾何可重複構建


## 快速開始

### 1. 環境要求

- Python **3.10+**
- [CadQuery](https://cadquery.readthedocs.io/) 2.4+（建議使用 conda 安裝以解決 OCP 依賴）
- [cq-editor](https://github.com/CadQuery/CQ-editor)（可選，用於可視化預覽）

### 2. 安裝依賴

推薦使用 conda：

```bash
conda create -n cadquery python=3.11
conda activate cadquery
conda install -c conda-forge -c cadquery cadquery
pip install -r requirements.txt
```

或純 pip（需系統已有 OCP 依賴）：

```bash
pip install -r requirements.txt
```

### 3. 在 cq-editor 中預覽

1. 啟動 cq-editor
2. 打開 `main.py`
3. 點擊 **Render** 即可看到智能秤儀表模型

### 4. 導出 GLB（用於 Web 前端）

所有 GLB 文件會輸出到 **`../../weighting_new/public/models/`**（項目上兩層的 `weighting_new/public/models`）：

```bash
# 儀表主體 -> terminal_base.glb
python tools/export_glb.py

# USB 配件
python tools/export_camera_glb.py      # -> usb_camera.glb
python tools/export_printer_glb.py     # -> printer.glb
python tools/export_scanner_glb.py     # -> scanner.glb
python tools/export_usb_drive_glb.py   # -> usb_disk.glb
```

也可指定自定義檔名：

```bash
python tools/export_glb.py my_terminal.glb
```

### 5. 為屏幕套用 App 截圖

1. 將 app 截圖保存為 `textures/screen_app.png`
2. 重新執行 `python tools/export_glb.py`
3. 腳本會自動偵測貼圖並覆蓋為帶 texture 的 GLB

也可手動調用：

```bash
python tools/apply_screen_texture.py
```

### 6. 運行測試

```bash
pytest tests/ -v
```

## 配置

全局參數集中於 [`src/config.py`](src/config.py)：

| 類別 | 參數 | 說明 |
|------|------|------|
| 公差 | `TOL`, `CLEARANCE`, `PRESS_FIT` | 加工公差與裝配間隙 |
| 緊固件 | `BOLT_HOLE`, `COUNTERBORE` | 常用螺栓通孔/沉頭孔 |
| 材料密度 | `DENSITY` | PLA / ABS / Aluminum 等 |
| 儀表尺寸 | `INST_W`, `INST_H`, `INST_D` ... | 外殼、屏幕、端口 |
| 導出精度 | `STL_TOLERANCE`, `STL_ANGULAR_TOLERANCE` | STL 網格精度 |

## 添加新零件

1. 在 `src/parts/` 或 `src/parts/accessories/` 下新建 `.py` 文件
2. 定義 `make_xxx()` 工廠函數，返回 `cq.Workplane` 或 `cq.Assembly`
3. 在 `main.py` 導入並用 `show_object()` 顯示
4. （可選）在 `tools/` 新建對應的 `export_xxx_glb.py`

## 導出 STEP / STL / DXF

```python
from src.utils.export import export_step, export_stl, export_all

export_step(my_part, name="bracket")
export_all(my_part, name="bracket", formats=("step", "stl"))
```

輸出位於 `exports/`，文件名自動帶時間戳。

## 相關項目

- **`weighting_new/`** — 配套的前端 Web 應用，消費本項目導出的 GLB 模型

## License

MIT

