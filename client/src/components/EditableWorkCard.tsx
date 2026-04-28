/**
 * EditableWorkCard Component
 * 可編輯的作品卡片，支援圖片上傳、標題和作者編輯
 */

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface EditableWorkCardProps {
  id: number;
  initialTitle?: string;
  initialAuthor?: string;
  onUpdate?: (data: { title: string; author: string; image?: string }) => void;
}

export default function EditableWorkCard({
  id,
  initialTitle = `作品 ${id}`,
  initialAuthor = `創作者 ${id}`,
  onUpdate,
}: EditableWorkCardProps) {
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [image, setImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setImage(imageData);
        onUpdate?.({ title, author, image: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onUpdate?.({ title, author });
  };

  const handleSave = () => {
    onUpdate?.({ title, author, image: image || undefined });
    setIsEditing(false);
  };

  return (
    <div
      className="group cursor-pointer"
      style={{
        animation: `fadeInUp 0.8s ease-out forwards`,
      }}
    >
      <div
        className="relative h-80 rounded-sm overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 235, 225, 0.9) 100%)",
          border: "2px solid #8b7355",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 報紙紋理背景 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/newspaper_bg-hH5LU7L2BPKryE4QQ7jC2U.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />

        {/* 圖片區域 */}
        {image ? (
          <div className="relative w-full h-40 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div
            className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload size={32} className="mx-auto mb-2 text-gray-400" />
              <p
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                點擊上傳圖片
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* 內容區域 */}
        <div className="relative z-10 p-4 flex flex-col justify-between h-40">
          {isEditing ? (
            <>
              <div className="space-y-2 flex-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-bold"
                  style={{
                    fontFamily: "'Noto Serif TC', serif",
                    color: "#5a4a3a",
                  }}
                  placeholder="作品標題"
                />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#6b5d4f",
                  }}
                  placeholder="創作者名稱"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h3
                  className="text-lg font-bold mb-1"
                  style={{
                    fontFamily: "'Noto Serif TC', serif",
                    color: "#5a4a3a",
                  }}
                >
                  {title}
                </h3>
                <p
                  className="text-xs mb-3"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#6b5d4f",
                  }}
                >
                  {author}
                </p>
                <div
                  className="w-6 h-0.5"
                  style={{ background: "#8b7355" }}
                />
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                編輯
              </button>
            </>
          )}
        </div>

        {/* 翻書動畫覆蓋層 */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(139, 115, 85, 0.1) 50%, transparent 100%)",
            animation: "pageFlip 0.6s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
