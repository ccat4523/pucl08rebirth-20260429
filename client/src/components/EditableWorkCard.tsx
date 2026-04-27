/**
 * EditableWorkCard Component
 * 可編輯的作品卡片 - 支援 2 張圖片 + 1 個影片
 * 只有上傳了內容才在訪客端顯示
 */

import { useEffect, useRef, useState } from "react";
import { Upload, X, Edit2, Save } from "lucide-react";

interface WorkData {
  id: number;
  title: string;
  author: string;
  images: (string | undefined)[];
  video?: string;
  hasContent: boolean;
}

interface EditableWorkCardProps {
  id: number;
  initialTitle: string;
  initialAuthor: string;
}

export default function EditableWorkCard({
  id,
  initialTitle,
  initialAuthor,
}: EditableWorkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorMode, setIsAuthorMode] = useState(true);
  const [work, setWork] = useState<WorkData>({
    id,
    title: initialTitle,
    author: initialAuthor,
    images: [undefined, undefined],
    video: undefined,
    hasContent: false,
  });

  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editAuthor, setEditAuthor] = useState(initialAuthor);

  // 從 localStorage 讀取作品數據
  useEffect(() => {
    const saved = localStorage.getItem(`work_${id}`);
    if (saved) {
      const data = JSON.parse(saved);
      setWork(data);
      setEditTitle(data.title);
      setEditAuthor(data.author);
    }
  }, [id]);

  // 保存到 localStorage
  const saveToStorage = (updatedWork: WorkData) => {
    localStorage.setItem(`work_${id}`, JSON.stringify(updatedWork));
  };

  // 檢查是否有內容
  const checkHasContent = (images: (string | undefined)[], video?: string) => {
    const hasImages = images.some((img) => img !== undefined);
    const hasVideo = video !== undefined;
    return hasImages || hasVideo;
  };

  // 處理圖片上傳
  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newImages = [...work.images];
      newImages[index] = imageUrl;
      const hasContent = checkHasContent(newImages, work.video);
      const updatedWork = { ...work, images: newImages, hasContent };
      setWork(updatedWork);
      saveToStorage(updatedWork);
    };
    reader.readAsDataURL(file);
  };

  // 處理影片上傳
  const handleVideoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const videoUrl = event.target?.result as string;
      const hasContent = checkHasContent(work.images, videoUrl);
      const updatedWork = { ...work, video: videoUrl, hasContent };
      setWork(updatedWork);
      saveToStorage(updatedWork);
    };
    reader.readAsDataURL(file);
  };

  // 移除圖片
  const handleRemoveImage = (index: number) => {
    const newImages = [...work.images];
    newImages[index] = undefined;
    const hasContent = checkHasContent(newImages, work.video);
    const updatedWork = { ...work, images: newImages, hasContent };
    setWork(updatedWork);
    saveToStorage(updatedWork);
  };

  // 移除影片
  const handleRemoveVideo = () => {
    const hasContent = checkHasContent(work.images, undefined);
    const updatedWork = { ...work, video: undefined, hasContent };
    setWork(updatedWork);
    saveToStorage(updatedWork);
  };

  // 保存編輯
  const handleSaveEdit = () => {
    const updatedWork = { ...work, title: editTitle, author: editAuthor };
    setWork(updatedWork);
    saveToStorage(updatedWork);
    setIsEditing(false);
  };

  // 切換編輯/訪客模式
  const toggleMode = () => {
    setIsAuthorMode(!isAuthorMode);
  };

  // 訪客端：如果沒有內容，不顯示卡片
  if (!isAuthorMode && !work.hasContent) {
    return null;
  }

  return (
    <div className="relative">
      {/* 模式切換按鈕（僅作者端可見） */}
      {isAuthorMode && (
        <button
          onClick={toggleMode}
          className="absolute -top-8 right-0 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors z-10"
        >
          切換到訪客模式
        </button>
      )}

      {/* 訪客端模式指示器 */}
      {!isAuthorMode && (
        <button
          onClick={toggleMode}
          className="absolute -top-8 right-0 text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors z-10"
        >
          切換到編輯模式
        </button>
      )}

      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          border: "2px dashed #8b7355",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* 圖片區域 */}
        <div className="grid grid-cols-2 gap-2 p-4">
          {work.images.map((image, index) => (
            <div key={index} className="relative">
              <div
                className="w-full h-40 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 235, 225, 0.9) 100%)",
                  border: "1px solid #d4af37",
                }}
              >
                {image ? (
                  <>
                    <img
                      src={image}
                      alt={`圖片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isAuthorMode && (
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <Upload size={24} className="text-gray-400 mb-1" />
                    <p
                      className="text-xs text-gray-600 text-center px-2"
                      style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                    >
                      上傳圖片 {index + 1}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(index, file);
                        }
                      }}
                      className="hidden"
                      disabled={!isAuthorMode}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 影片區域 */}
        <div className="p-4 pt-2 border-t border-gray-200">
          <div
            className="w-full h-32 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 235, 225, 0.9) 100%)",
              border: "1px solid #d4af37",
            }}
          >
            {work.video ? (
              <>
                <video
                  src={work.video}
                  className="w-full h-full object-cover"
                  controls
                />
                {isAuthorMode && (
                  <button
                    onClick={handleRemoveVideo}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <Upload size={20} className="text-gray-400 mb-1" />
                <p
                  className="text-xs text-gray-600"
                  style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                >
                  上傳影片
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleVideoUpload(file);
                    }
                  }}
                  className="hidden"
                  disabled={!isAuthorMode}
                />
              </label>
            )}
          </div>
        </div>

        {/* 標題和作者區域 */}
        <div className="p-4 border-t border-gray-200">
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
              <button
                onClick={handleSaveEdit}
                className="w-full px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
              >
                <Save size={14} />
                保存
              </button>
            </div>
          ) : (
            <>
              <h3
                className="font-bold text-center mb-1"
                style={{
                  fontFamily: "'Noto Serif TC', serif",
                  color: "#5a4a3a",
                  fontSize: "0.95rem",
                }}
              >
                {work.title}
              </h3>
              <p
                className="text-center text-sm"
                style={{
                  fontFamily: "'Noto Serif TC', serif",
                  color: "#8b7355",
                }}
              >
                {work.author}
              </p>
              {isAuthorMode && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit2 size={14} />
                  編輯
                </button>
              )}
            </>
          )}
        </div>

        {/* 作者端提示 */}
        {isAuthorMode && (
          <div
            className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-xs text-center"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#856404",
            }}
          >
            ✓ 編輯模式 - 訪客將只看到已上傳內容的卡片
          </div>
        )}
      </div>
    </div>
  );
}
