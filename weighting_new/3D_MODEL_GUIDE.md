# 宏德智能秤 3D 模型導入指南

為了讓官網達到電影級的產品展示效果，請參考以下規格準備 3D 素材。

## 1. 檔案存放位置
請將所有 3D 相關檔案放在以下目錄：
`public/models/`

## 2. 建議檔案格式
*   **格式**: `.glb` (GLB 是最推薦的格式，它將模型、貼圖、材質封裝在一個二進位檔案中，讀取速度最快)。
*   **大小限制**: 單個檔案建議控制在 **3MB - 8MB** 之間，以確保網頁加載流暢。
*   **軟體導出**: 如果使用 Blender，導出時請勾選 "Apply Modifiers" 並確保 "Include Custom Properties" 開啟。

## 3. 需要準備的組件檔案
為了實現「動態選配」功能，你需要將產品拆解為以下獨立檔案：

| 組件名稱 | 建議檔名 | 說明 |
| :--- | :--- | :--- |
| **主機儀表** | `terminal_base.glb` | 核心安卓儀表，包含螢幕與後殼。 |
| **掃碼槍** | `scanner.glb` | 獨立的掃描槍模型。 |
| **隨身碟** | `usb_disk.glb` | 獨立的 USB 隨身碟模型。 |
| **列印機** | `printer.glb` | 獨立的標籤列印機模型。 |

## 4. 座標對齊 (重要！)
*   所有選配組件（掃碼槍、列印機等）在建模軟體中，應以 **「與主機連接的接觸點」** 為原點 (0,0,0)。
*   這樣當我在程式中將其 `visible` 設為 true 時，它們才會精準地出現在主機的 USB 孔或旁邊，而不會飛到螢幕外面。

## 5. 代碼替換方式
當你準備好 `terminal_base.glb` 後，我會將 `product-3d-viewer.jsx` 裡的 `BaseTerminal` 替換為：
```javascript
const { scene } = useGLTF('/models/terminal_base.glb')
return <primitive object={scene} />
```

---
*如有任何建模上的技術疑問，請隨時聯繫 Cascade。*
