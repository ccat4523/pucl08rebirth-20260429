/**
 * EditableWorkCard Component
 * 可編輯的作品卡片 - 支援 2 張圖片 + 1 個影片，使用資料庫和檔案存儲
 */

import { useEffect, useState } from "react";
import { Upload, X, Edit2, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface EditableWorkCardProps {
  id: number;
  workNumber: number;
  initialTitle: string;
  initialAuthor: string;
}

export default function EditableWorkCard({
  id,
  workNumber,
  initialTitle,
  initialAuthor,
}: EditableWorkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorMode, setIsAuthorMode] = useState(true);
  
  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editAuthor, setEditAuthor] = useState(initialAuthor);
  
  const [images, setImages] = useState<(File | null)[]>([null, null]);
  const [video, setVideo] = useState<File | null>(null);
  
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([null, null]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // 獲取作品數據
  const { data: work, isLoading } = trpc.works.getById.useQuery(id);
  
  // 更新作品的 mutation
  const updateWorkMutation = trpc.works.update.useMutation();

  // 初始化數據
  useEffect(() => {
    if (work) {
      setEditTitle(work.title || initialTitle);
      setEditAuthor(work.author || initialAuthor);
      setImageUrls([work.image1Url || null, work.image2Url || null]);
      setVideoUrl(work.videoUrl || null);
    }
  }, [work]);

  // 上傳檔案到 S3
  const uploadFile = async (file: File, type: 'image' | 'video'): Promise<{url: string, key: string}> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
  };

  // 檔案上傳處理 - 上傳到 S3 並顯示預覽
  const handleImageChange = async (index: number, file: File | null) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    
    if (file) {
      try {
        // 先顯示本地預覽
        const reader = new FileReader();
        reader.onload = (e) => {
          const newUrls = [...imageUrls];
          newUrls[index] = e.target?.result as string;
          setImageUrls(newUrls);
        };
        reader.readAsDataURL(file);
        
        // 上傳到 S3
        const { url } = await uploadFile(file, 'image');
        const newUrls = [...imageUrls];
        newUrls[index] = url;
        setImageUrls(newUrls);
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('圖片上傳失敗，請重試');
      }
    }
  };

  const handleVideoChange = async (file: File | null) => {
    setVideo(file);
    if (file) {
      try {
        // 先顯示本地預覽
        const reader = new FileReader();
        reader.onload = (e) => {
          setVideoUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // 上傳到 S3
        const { url } = await uploadFile(file, 'video');
        setVideoUrl(url);
      } catch (error) {
        console.error('Video upload failed:', error);
        alert('影片上傳失敗，請重試');
      }
    }
  };

  // 保存作品
  const handleSave = async () => {
    try {
      // 只保存已上傳到 S3 的 URL（不包含 base64）
      const image1Url = imageUrls[0]?.startsWith('http') ? imageUrls[0] : undefined;
      const image2Url = imageUrls[1]?.startsWith('http') ? imageUrls[1] : undefined;
      const finalVideoUrl = videoUrl?.startsWith('http') ? videoUrl : undefined;
      
      await updateWorkMutation.mutateAsync({
        id,
        title: editTitle,
        author: editAuthor,
        image1Url,
        image2Url,
        videoUrl: finalVideoUrl,
      });
      setIsEditing(false);
      alert('作品已保存！');
    } catch (error) {
      console.error("Failed to save work:", error);
      alert('保存失敗，請重試');
    }
  };

  // 檢查是否有內容
  const hasContent = imageUrls.some(url => url) || videoUrl;

  // 訪客模式下，如果沒有內容則不顯示
  if (!isAuthorMode && !hasContent) {
    return null;
  }

  return (
    <div
      className="rounded-lg overflow-hidden transition-all hover:shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        border: "2px solid #8b7355",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* 圖片和影片區域 */}
      <div className="relative bg-gray-100 aspect-square flex flex-col gap-2 p-4">
        {/* 圖片 1 */}
        <div className="flex-1 flex items-center justify-center bg-gray-200 rounded relative group">
          {imageUrls[0] ? (
            <>
              <img src={imageUrls[0]} alt="Image 1" className="w-full h-full object-cover" />
              {isEditing && (
                <button
                  onClick={() => {
                    handleImageChange(0, null);
                    const newUrls = [...imageUrls];
                    newUrls[0] = null;
                    setImageUrls(newUrls);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              )}
            </>
          ) : isEditing ? (
            <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
              <Upload size={24} />
              <span className="text-xs">上傳圖片 1</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(0, e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          ) : (
            <span className="text-gray-400 text-sm">無圖片</span>
          )}
        </div>

        {/* 圖片 2 */}
        <div className="flex-1 flex items-center justify-center bg-gray-200 rounded relative group">
          {imageUrls[1] ? (
            <>
              <img src={imageUrls[1]} alt="Image 2" className="w-full h-full object-cover" />
              {isEditing && (
                <button
                  onClick={() => {
                    handleImageChange(1, null);
                    const newUrls = [...imageUrls];
                    newUrls[1] = null;
                    setImageUrls(newUrls);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              )}
            </>
          ) : isEditing ? (
            <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
              <Upload size={24} />
              <span className="text-xs">上傳圖片 2</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(1, e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          ) : (
            <span className="text-gray-400 text-sm">無圖片</span>
          )}
        </div>

        {/* 影片 */}
        <div className="flex-1 flex items-center justify-center bg-gray-200 rounded relative group">
          {videoUrl ? (
            <>
              <video src={videoUrl} className="w-full h-full object-cover" />
              {isEditing && (
                <button
                  onClick={() => {
                    setVideo(null);
                    setVideoUrl(null);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
              )}
            </>
          ) : isEditing ? (
            <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
              <Upload size={24} />
              <span className="text-xs">上傳影片</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          ) : (
            <span className="text-gray-400 text-sm">無影片</span>
          )}
        </div>
      </div>

      {/* 標題和作者區域 */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="作品標題"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            />
            <input
              type="text"
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="創作者名稱"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            />
          </div>
        ) : (
          <>
            <h3
              className="font-bold text-sm"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "#5a4a3a",
              }}
            >
              {editTitle}
            </h3>
            <p
              className="text-xs"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "#8b7355",
              }}
            >
              {editAuthor}
            </p>
          </>
        )}
      </div>

      {/* 按鈕區域 */}
      <div className="px-4 pb-4 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={updateWorkMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
            >
              <Save size={16} />
              保存
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              取消
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              <Edit2 size={16} />
              編輯
            </button>
            <button
              onClick={() => setIsAuthorMode(!isAuthorMode)}
              className="flex-1 px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              {isAuthorMode ? "切換到訪客模式" : "切換到編輯模式"}
            </button>
          </>
        )}
      </div>

      {isAuthorMode && (
        <div className="px-4 pb-2 text-xs text-green-600 text-center">
          ✓ 編輯模式 - 訪客將只看到已上傳內容的卡片
        </div>
      )}
    </div>
  );
}
