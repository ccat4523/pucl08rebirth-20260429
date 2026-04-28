/**
 * Work Detail Page - 小組作品詳情
 * Design: 報紙風格 × 古典文學
 * Features: 1 張圖片 + 100 字介紹（可編輯）
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function WorkDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/work/:id");
  const workId = params?.id ? parseInt(params.id, 10) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    author: "",
    description: "",
    image1Url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: work, isLoading } = trpc.works.getById.useQuery(
    workId || 0,
    { enabled: !!workId }
  );

  const updateMutation = trpc.works.update.useMutation();

  useEffect(() => {
    if (work) {
      setEditData({
        title: work.title || "",
        author: work.author || "",
        description: work.description || "",
        image1Url: work.image1Url || "",
      });
    }
  }, [work]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // 預覽圖片
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditData({
          ...editData,
          image1Url: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!workId) return;

    try {
      setIsUploading(true);

      // 如果有新的圖片，先上傳
      let finalImageUrl = editData.image1Url;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("workId", workId.toString());

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          finalImageUrl = url;
        }
      }

      // 更新作品資訊
      await updateMutation.mutateAsync({
        id: workId,
        title: editData.title,
        author: editData.author,
        description: editData.description,
        image1Url: finalImageUrl,
      });

      setIsEditing(false);
      setImageFile(null);
      alert("作品資訊已更新");
    } catch (error) {
      alert("更新失敗，請重試");
    } finally {
      setIsUploading(false);
    }
  };

  if (!workId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>無效的作品 ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>載入中...</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>找不到該作品</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#e8dfd2",
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/taiwan_newspaper_simple_bg-iPydLff9wBGrCjJy6EC5j3.webp)`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />

      {/* ===== WORK DETAIL SECTION ===== */}
      <section
        className="py-16 px-4"
        style={{
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <div
          className="max-w-3xl mx-auto p-8 rounded-sm"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            border: "2px solid #8b7355",
          }}
        >
          {/* 返回按鈕 */}
          <a
            href="/"
            className="inline-block mb-6 text-sm"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#8b7355",
              textDecoration: "none",
            }}
          >
            ← 返回
          </a>

          {/* 標題和作者區 */}
          <div className="mb-8">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="w-full text-3xl font-bold p-2 border rounded mb-4"
                  style={{
                    fontFamily: "'Noto Serif TC', serif",
                    color: "#5a4a3a",
                    borderColor: "#8b7355",
                  }}
                  placeholder="作品標題"
                />
                <input
                  type="text"
                  value={editData.author}
                  onChange={(e) =>
                    setEditData({ ...editData, author: e.target.value })
                  }
                  className="w-full text-lg p-2 border rounded"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#6b5d4f",
                    borderColor: "#8b7355",
                  }}
                  placeholder="創作者"
                />
              </>
            ) : (
              <>
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{
                    fontFamily: "'Noto Serif TC', serif",
                    color: "#5a4a3a",
                  }}
                >
                  {editData.title || `第 ${work.workNumber} 組`}
                </h1>
                <p
                  className="text-lg"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#6b5d4f",
                  }}
                >
                  創作者：{editData.author || "待公布"}
                </p>
              </>
            )}
          </div>

          {/* 1 張圖片 */}
          <div className="mb-8">
            <div
              className="w-full aspect-square flex items-center justify-center rounded-sm overflow-hidden"
              style={{
                background: "rgba(200, 180, 160, 0.3)",
                border: "2px solid #8b7355",
                minHeight: "400px",
              }}
            >
              {editData.image1Url ? (
                <img
                  src={editData.image1Url}
                  alt="作品圖片"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#a89080",
                  }}
                >
                  暫無圖片
                </p>
              )}
            </div>

            {/* 圖片上傳區（編輯模式） */}
            {isEditing && (
              <div className="mt-4">
                <label
                  className="block p-4 border-2 border-dashed rounded-sm text-center cursor-pointer"
                  style={{
                    borderColor: "#8b7355",
                    background: "rgba(200, 180, 160, 0.1)",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      color: "#8b7355",
                    }}
                  >
                    點擊上傳圖片
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* 詳細介紹（100 字篇幅） */}
          <div className="mb-8">
            <h3
              className="text-xl font-bold mb-4"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "#5a4a3a",
              }}
            >
              作品介紹
            </h3>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full p-4 border rounded-sm min-h-[200px]"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#5a4a3a",
                  borderColor: "#8b7355",
                  lineHeight: "1.8",
                }}
                placeholder="輸入作品介紹文案（約 100 字）..."
                maxLength={200}
              />
            ) : (
              <p
                className="leading-relaxed"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#5a4a3a",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {editData.description || "暇無介紹文案"}
              </p>
            )}
            {isEditing && (
              <p
                className="text-xs mt-2"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#a89080",
                }}
              >
                字數：{editData.description.length} / 200
              </p>
            )}
          </div>

          {/* 編輯按鈕 */}
          {user?.role === "admin" && (
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isUploading || updateMutation.isPending}
                    className="px-6 py-2 rounded-sm font-bold transition-all"
                    style={{
                      background: "#d4a574",
                      color: "#ffffff",
                      border: "none",
                      cursor: isUploading || updateMutation.isPending ? "not-allowed" : "pointer",
                      opacity: isUploading || updateMutation.isPending ? 0.6 : 1,
                    }}
                  >
                    {isUploading || updateMutation.isPending ? "保存中..." : "完成編輯"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setImageFile(null);
                      if (work) {
                        setEditData({
                          title: work.title || "",
                          author: work.author || "",
                          description: work.description || "",
                          image1Url: work.image1Url || "",
                        });
                      }
                    }}
                    className="px-6 py-2 rounded-sm font-bold transition-all"
                    style={{
                      background: "#c0b0a0",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    取消
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-sm font-bold transition-all"
                  style={{
                    background: "#d4a574",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  編輯
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
