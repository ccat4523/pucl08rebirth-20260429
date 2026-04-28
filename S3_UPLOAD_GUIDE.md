# 蛻生畢展 - S3 上傳設定完整指南

## 📋 系統架構概述

```
用戶上傳檔案
    ↓
/api/upload 端點（multer 處理）
    ↓
storagePut() 函數
    ↓
Forge API 獲取 presigned URL
    ↓
直接上傳到 S3
    ↓
返回 /manus-storage/{key} URL
    ↓
storageProxy 代理（307 redirect）
    ↓
S3 簽名 URL
    ↓
瀏覽器下載/顯示
```

---

## 🔧 核心配置檔案

### 1. **環境變數** (`server/_core/env.ts`)

```typescript
// 必須設置以下環境變數：
BUILT_IN_FORGE_API_URL    // Manus Forge API 基礎 URL
BUILT_IN_FORGE_API_KEY    // Forge API 認證密鑰
DATABASE_URL              // 數據庫連接字串
```

**檢查方式：**
```bash
cd /home/ubuntu/pumc18light-clone
echo $BUILT_IN_FORGE_API_URL
echo $BUILT_IN_FORGE_API_KEY
```

### 2. **上傳端點** (`server/_core/index.ts` 第 47-63 行)

```typescript
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const fileType = req.body.type || 'file';
    const fileKey = `uploads/${fileType}/${Date.now()}-${req.file.originalname}`;
    
    // 調用 storagePut 上傳到 S3
    const { url, key } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
    
    res.json({ url, key });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

**重點：**
- 接受 multipart/form-data 格式
- 檔案大小限制：50MB
- 返回格式：`{ url: '/manus-storage/{key}', key: '...' }`

### 3. **儲存函數** (`server/storage.ts` 第 31-72 行)

```typescript
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));

  // 1. 從 Forge API 獲取 presigned PUT URL
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);

  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  const { url: s3Url } = await presignResp.json();

  // 2. 直接上傳到 S3
  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  return { key, url: `/manus-storage/${key}` };
}
```

### 4. **代理端點** (`server/_core/storageProxy.ts`)

```typescript
app.get("/manus-storage/*", async (req, res) => {
  const key = (req.params as Record<string, string>)["0"];
  
  // 從 Forge API 獲取簽名 URL
  const forgeUrl = new URL(
    "v1/storage/presign/get",
    ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
  );
  forgeUrl.searchParams.set("path", key);

  const forgeResp = await fetch(forgeUrl, {
    headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
  });

  const { url } = await forgeResp.json();
  
  // 307 redirect 到 S3 簽名 URL
  res.set("Cache-Control", "no-store");
  res.redirect(307, url);
});
```

---

## 🐛 常見問題診斷

### 問題 1：圖片/影片上傳成功但無法顯示

**症狀：**
- 上傳時看到「上傳中...」完成
- 但頁面刷新後圖片/影片消失
- 或顯示「暫無圖片」

**根本原因：**
- URL 驗證邏輯過於嚴格（只接受 http 開頭）
- 數據庫沒有保存 `/manus-storage/` 開頭的 URL

**解決方案：**
已在 `EditableWorkCard.tsx` 第 124-131 行修復：

```typescript
const isValidUrl = (url?: string | null) => {
  if (!url) return false;
  return url.startsWith('/manus-storage/') || url.startsWith('http');
};

const image1Url = isValidUrl(imageUrls[0]) ? (imageUrls[0] as string) : undefined;
```

**驗證方法：**
1. 打開瀏覽器開發者工具（F12）
2. 進入「Network」標籤
3. 上傳一張圖片
4. 查看 `/api/upload` 的響應
5. 確認返回的 URL 格式：`/manus-storage/uploads/image/...`

### 問題 2：Forge API 返回 500 錯誤

**症狀：**
```
[StorageProxy] forge error: 500 {"error":"failed to generate presigned GET URL: unable to sign resource..."}
```

**根本原因：**
- 檔案名稱包含非 ASCII 字符（例如中文）
- Forge API 無法簽名包含 Unicode 的 URL

**解決方案：**
修改 `server/storage.ts` 第 54 行，使用 URL 編碼的檔案名稱：

```typescript
// 修改前
const fileKey = `uploads/${fileType}/${Date.now()}-${req.file.originalname}`;

// 修改後（使用 URL 編碼）
const fileKey = `uploads/${fileType}/${Date.now()}-${encodeURIComponent(req.file.originalname)}`;
```

或使用 UUID 替換檔案名稱：

```typescript
import { randomUUID } from 'crypto';

const ext = req.file.originalname.split('.').pop();
const fileKey = `uploads/${fileType}/${Date.now()}-${randomUUID()}.${ext}`;
```

### 問題 3：影片無法播放

**症狀：**
- 影片 URL 正確
- 但 `<video>` 標籤顯示黑屏或無法播放

**根本原因：**
- 307 redirect 可能導致 Range request 失敗
- 瀏覽器無法尋求影片位置

**解決方案：**
在 `WorkDetail.tsx` 中使用 `onCanPlay` 事件處理：

```typescript
<video
  src={editData.image1Url}
  controls
  className="w-full max-w-md rounded"
  onCanPlay={() => console.log('Video ready')}
  onError={(e) => console.error('Video error:', e)}
/>
```

或改用直接的簽名 URL（不經過代理）：

```typescript
import { storageGetSignedUrl } from '@/server/storage';

const signedUrl = await storageGetSignedUrl(key);
// 使用 signedUrl 而不是 /manus-storage/...
```

### 問題 4：自動儲存沒有保存圖片 URL

**症狀：**
- 編輯文案時自動儲存成功
- 但圖片 URL 沒有保存到數據庫

**根本原因：**
- 自動儲存只監視 `editData` 變化
- 但圖片上傳完成後 `image1Url` 可能是 base64（還沒上傳到 S3）

**解決方案：**
在 `AdminPanel.tsx` 中，確保圖片上傳完成後才觸發自動儲存：

```typescript
// 修改 handleUploadImage
const handleUploadImage = async () => {
  if (!imageFile) return;

  try {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      const { url } = await uploadResponse.json();
      setEditData({
        ...editData,
        image1Url: url,  // 設置真實 URL，觸發自動儲存
      });
      setImageFile(null);
    }
  } catch (error) {
    alert("上傳失敗");
  } finally {
    setIsUploading(false);
  }
};
```

---

## ✅ 完整的上傳流程測試

### 步驟 1：檢查環境變數

```bash
cd /home/ubuntu/pumc18light-clone

# 檢查 Forge API 配置
grep -r "BUILT_IN_FORGE_API" server/_core/env.ts

# 檢查是否正確注入
echo $BUILT_IN_FORGE_API_URL
echo $BUILT_IN_FORGE_API_KEY
```

### 步驟 2：測試上傳端點

```bash
# 使用 curl 測試上傳
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/test-image.jpg" \
  -F "type=image"

# 預期響應
# {"url":"/manus-storage/uploads/image/1777388077713-test-image_a1b2c3d4.jpg","key":"uploads/image/1777388077713-test-image_a1b2c3d4.jpg"}
```

### 步驟 3：測試代理端點

```bash
# 測試 /manus-storage/ 代理
curl -I http://localhost:3000/manus-storage/uploads/image/1777388077713-test-image_a1b2c3d4.jpg

# 預期響應
# HTTP/1.1 307 Temporary Redirect
# Location: https://d36hbw14aib5lz.cloudfront.net/...
```

### 步驟 4：在瀏覽器中測試

1. 打開管理員後台：`http://localhost:3000/admin`
2. 選擇一個作品
3. 點擊「上傳圖片」
4. 選擇一張圖片檔案
5. 點擊「上傳」按鈕
6. 驗證：
   - 上傳完成後應看到圖片預覽
   - 刷新頁面後圖片仍然存在
   - 返回首頁應能看到圖片

---

## 📊 數據庫驗證

### 檢查圖片 URL 是否正確保存

```sql
-- 查看作品的圖片 URL
SELECT id, title, image1Url FROM works LIMIT 5;

-- 預期結果
-- id | title | image1Url
-- 1  | 作品1 | /manus-storage/uploads/image/1777388077713-test_a1b2c3d4.jpg
```

### 檢查宣傳片 URL

```sql
-- 查看宣傳片 URL
SELECT id, title, videoUrl FROM promotionalVideos LIMIT 1;

-- 預期結果
-- id | title | videoUrl
-- 1  | Test Promo Video | /manus-storage/uploads/video/1777388415482-promo_eb44b295.mp4
```

---

## 🚀 優化建議

### 1. 添加上傳進度條

```typescript
const handleImageChange = async (index: number, file: File | null) => {
  if (file) {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        console.log(`Upload progress: ${percentComplete}%`);
        // 更新 UI 進度條
      }
    });
    
    // ... 上傳邏輯
  }
};
```

### 2. 添加圖片壓縮

```typescript
const compressImage = async (file: File): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width * 0.8;
      canvas.height = img.height * 0.8;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(file);
  });
};
```

### 3. 添加上傳重試邏輯

```typescript
const uploadWithRetry = async (file: File, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { url } = await uploadFile(file, 'image');
      return url;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## 📞 故障排除檢查清單

- [ ] 環境變數 `BUILT_IN_FORGE_API_URL` 和 `BUILT_IN_FORGE_API_KEY` 已設置
- [ ] `/api/upload` 端點可訪問（返回 200 或 400）
- [ ] 上傳的檔案名稱不包含非 ASCII 字符，或已 URL 編碼
- [ ] 返回的 URL 格式為 `/manus-storage/uploads/{type}/{timestamp}-{filename}`
- [ ] 數據庫中 `image1Url` 和 `videoUrl` 欄位已正確保存 URL
- [ ] `/manus-storage/` 代理正確 redirect 到 S3 簽名 URL
- [ ] 瀏覽器開發者工具 Network 標籤中沒有 CORS 錯誤
- [ ] 頁面刷新後圖片/影片仍然可見

---

## 📝 相關檔案位置

| 檔案 | 位置 | 用途 |
|------|------|------|
| 上傳端點 | `server/_core/index.ts` 第 47-63 行 | 處理 /api/upload 請求 |
| 儲存函數 | `server/storage.ts` | S3 上傳和簽名 URL 邏輯 |
| 代理端點 | `server/_core/storageProxy.ts` | /manus-storage/ 代理 |
| 前端上傳 | `client/src/components/EditableWorkCard.tsx` 第 52-68 行 | 上傳檔案到 S3 |
| 管理員上傳 | `client/src/pages/AdminPanel.tsx` 第 387-428 行 | 管理員後台上傳 |
| 宣傳片上傳 | `client/src/pages/Home.tsx` 第 381-407 行 | 宣傳片編輯上傳 |

