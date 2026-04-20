# 3D 模型資源目錄

## 放置檔案

將你的 GLB 模型直接放在此資料夾，例如：

```
public/models/terminal_base.glb
```

## 啟用 GLB

預設系統會用程序化幾何當 placeholder。要切換成你的 GLB：

1. 確認檔案已放在 `public/models/` 底下
2. 到 `content/data/products/<product-id>.json` 修改：

```json
"baseModel": {
  "path": "/models/terminal_base.glb",
  "status": "ready",
  "transform": {
    "scale": 1,
    "rotation": [0, 0, 0],
    "position": [0, 0, 0]
  }
}
```

把 `status` 從 `"placeholder"` 改成 `"ready"`，系統就會載入 GLB。

## 座標對齊建議

建模時把儀表頭中心放在原點 `(0, 0, 0)`，Z 軸朝向鏡頭（正面），Y 軸向上。

若 GLB 載入後方向或大小不對，不用重新匯出，直接在上面的 `transform` 裡調整：

| 欄位 | 說明 | 範例 |
| --- | --- | --- |
| `scale` | 整體縮放（單一數字或 `[x,y,z]`） | `0.5`（縮小一半）或 `[1, 1, 1]` |
| `rotation` | XYZ 旋轉（弧度） | `[0, 3.14, 0]` 代表繞 Y 軸旋轉 180° |
| `position` | 偏移位置 | `[0, -0.2, 0]` 代表向下移 0.2 |

## 載入錯誤處理

若 GLB 載入失敗（檔案缺失、格式錯誤），畫面會自動降級為程序化 placeholder，並在瀏覽器 console 顯示警告，不會整個 3D 區塊崩潰。

## 檔案大小建議

- 單檔 **3~8MB** 最佳
- 超過 10MB 建議用 Draco 壓縮（之後若需要可另外接入 `DRACOLoader`）
