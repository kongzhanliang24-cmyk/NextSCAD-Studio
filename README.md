# NextSCAD Studio

**沉浸式智能秤產品官網** — 結合 3D 互動配置器、滾動敘事動畫與中英雙語切換，展示工業智能稱重系統的完整產品線。

> **線上預覽：** <https://kongzhanliang24-cmyk.github.io/NextSCAD-Studio/>

---

## 核心亮點

- **3D 互動產品配置器** — 基於 Three.js / React Three Fiber，載入 CadQuery 參數化建模導出的 GLB 模型，支持配件選配、線纜動態繪製與多視角切換
- **滾動驅動敘事動畫** — GSAP + ScrollTrigger + Lenis 打造沉浸式品牌故事，含 3D 翻頁轉場效果
- **中英雙語即時切換** — 全站支持中文 / English 一鍵切換，語言偏好本地持久化
- **響應式設計** — 從手機到桌面全適配，Tailwind CSS 驅動的現代深色 UI
- **CAD → Web 工作流** — Python（CadQuery）參數化建模，一鍵導出 GLB 直接上線

---

## 頁面導覽

- **首頁** — 品牌 Hero 動畫 → 故事敘事 → 精選產品 / 方案 / 案例
- **產品** — 分類瀏覽 + 型號詳情頁（含 3D 配置器）
- **解決方案** — 倉儲稱重 / 車輛過磅系統方案
- **案例** — 食品加工 / 冷鏈行業導入成果
- **關於** — 企業簡介、核心優勢與認證資質
- **聯絡** — 需求表單與聯絡資訊

---

## 技術棧

- **前端框架** — Next.js 14 (App Router), React 18
- **3D 渲染** — Three.js, @react-three/fiber, drei
- **樣式** — TailwindCSS, PostCSS
- **動畫** — GSAP, ScrollTrigger, Lenis
- **CAD 建模** — Python 3.10+, CadQuery 2.4+
- **部署** — GitHub Pages（靜態導出）

---

## 本地開發

```bash
# 安裝依賴
cd weighting_new
npm install

# 啟動開發伺服器
npm run dev
```

預設在 **http://localhost:3000** 開啟。

如需重新導出 3D 模型，請參考 [`openscad/cad_project/README.md`](openscad/cad_project/README.md)。

---

## License

MIT