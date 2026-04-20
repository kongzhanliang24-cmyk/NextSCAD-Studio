# NextSCAD Studio

一體化工作區：**參數化 CAD 建模** + **智能秤產品官網**。以 Python（CadQuery）定義智能秤儀表及配件的 3D 幾何，一鍵導出 GLB，供 Next.js 官網的 Three.js 場景直接使用。

## 倉庫組成

```
NextSCAD Studio/
├── openscad/
│   └── cad_project/        # CadQuery 參數化 3D 模型（Python）
│       ├── src/            # 零件 / 裝配體 / 配置
│       ├── tools/          # GLB 導出腳本
│       └── README.md       # CAD 子項目說明
└── weighting_new/          # Next.js 智能秤產品官網（React + Three.js）
    ├── app/                # Next.js App Router
    ├── components/
    ├── content/            # 站點數據（JSON，由 Excel 生成）
    ├── public/models/      # CAD 導出的 GLB 模型
    └── scripts/            # Excel <-> JSON 轉換工具
```

## 兩個子項目簡介

### `openscad/cad_project`  —  CAD 模型

- 純 Python 參數化建模（基於 [CadQuery](https://github.com/CadQuery/cadquery)）
- 可在 [cq-editor](https://github.com/CadQuery/CQ-editor) 中即時預覽
- 一鍵導出 GLB 到 `weighting_new/public/models/`，無需手動複製
- 詳見 [`openscad/cad_project/README.md`](openscad/cad_project/README.md)

### `weighting_new`  —  產品官網

- **Next.js 14** (App Router) + **React 18**
- **Three.js / @react-three/fiber / drei** 渲染 CAD 導出的 GLB
- **TailwindCSS** 樣式
- **GSAP + Lenis** 動畫與平滑滾動
- 站點內容由 Excel 模板生成 JSON（`scripts/excel-to-json.mjs`）

## 快速開始

### 1. CAD 建模與導出 GLB

```bash
cd openscad/cad_project
pip install -r requirements.txt

# 導出儀表主體
python tools/export_glb.py

# 導出配件
python tools/export_camera_glb.py
python tools/export_printer_glb.py
python tools/export_scanner_glb.py
python tools/export_usb_drive_glb.py
```

GLB 會直接輸出到 `weighting_new/public/models/`。

### 2. 啟動網站

```bash
cd weighting_new
npm install
npm run dev
```

預設在 http://localhost:3000。

### 3. 編輯站點內容

```bash
cd weighting_new
# 由模板 Excel 生成
npm run gen:template     # 生成 weighting_data_template.xlsx
# 將 Excel 轉為 JSON（站點實際讀取的數據源）
npm run gen:json
```

## 工作流

```
┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│ cad_project (Python) │ ───►  │ public/models/*.glb  │ ───►  │ weighting_new   │
│ CadQuery 參數化建模   │       │  Three.js 場景資源    │       │ Next.js 產品官網│
└──────────────────────┘       └──────────────────────┘       └─────────────────┘
```

修改幾何 → 重新執行 `python tools/export_*_glb.py` → 前端自動刷新。

## 技術棧

| 層 | 技術 |
|----|------|
| 建模 | Python 3.10+, CadQuery 2.4+, cq-editor |
| 前端 | Next.js 14, React 18, Three.js, @react-three/fiber, drei |
| 樣式 | TailwindCSS, PostCSS |
| 動畫 | GSAP, Lenis |
| 數據 | JSON（由 Excel `xlsx` 生成） |

## License

MIT