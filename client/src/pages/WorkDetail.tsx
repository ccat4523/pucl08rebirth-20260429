/**
 * Work Detail Page - 小組作品詳情
 * Design: 報紙風格 × 古典文學
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WorkDetail() {
  const [match, params] = useRoute("/work/:id");
  const { user } = useAuth();
  const workId = params?.id ? parseInt(params.id) : null;

  const { data: work } = trpc.works.getById.useQuery(workId || 0, {
    enabled: !!workId,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    author: "",
    description: "",
    image1Url: "",
    image2Url: "",
  });

  const updateWorkMutation = trpc.works.update.useMutation();

  useEffect(() => {
    if (work) {
      setEditData({
        title: work.title || "",
        author: work.author || "",
        description: work.description || "",
        image1Url: work.image1Url || "",
        image2Url: work.image2Url || "",
      });
    }
  }, [work]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageNum: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (!file || !workId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();
      if (imageNum === 1) {
        setEditData((prev) => ({ ...prev, image1Url: url }));
      } else {
        setEditData((prev) => ({ ...prev, image2Url: url }));
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const handleSave = async () => {
    if (!workId) return;

    try {
      await updateWorkMutation.mutateAsync({
        id: workId,
        title: editData.title,
        author: editData.author,
        description: editData.description,
        image1Url: editData.image1Url,
        image2Url: editData.image2Url,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (!match || !workId) {
    return <div>Not found</div>;
  }

  const isAdmin = user?.role === "admin";

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

      {/* 詳情內容 */}
      <section
        className="py-20 px-4 min-h-screen"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.8) 0%, rgba(232, 223, 210, 0.6) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* 返回按鈕 */}
          <a
            href="/"
            className="inline-block mb-8 px-4 py-2 rounded-sm"
            style={{
              background: "rgba(139, 115, 85, 0.2)",
              color: "#5a4a3a",
              fontFamily: "'Noto Sans TC', sans-serif",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "rgba(139, 115, 85, 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "rgba(139, 115, 85, 0.2)";
            }}
          >
            ← 返回
          </a>

          {/* 編輯按鈕 */}
          {isAdmin && (
            <div className="mb-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 rounded-sm"
                style={{
                  background: isEditing ? "#8b7355" : "rgba(139, 115, 85, 0.3)",
                  color: "#fff",
                  fontFamily: "'Noto Sans TC', sans-serif",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {isEditing ? "完成編輯" : "編輯"}
              </button>
            </div>
          )}

          {/* 主要內容卡片 */}
          <div
            className="p-8 sm:p-12 rounded-sm"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #8b7355",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* 標題和作者 */}
            <div className="mb-8">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full text-3xl font-bold mb-4 p-2 border-2 border-dashed border-gray-300"
                    style={{
                      fontFamily: "'Noto Serif TC', serif",
                      color: "#5a4a3a",
                    }}
                    placeholder="作品標題"
                  />
                  <input
                    type="text"
                    value={editData.author}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className="w-full text-lg p-2 border-2 border-dashed border-gray-300"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      color: "#6b5d4f",
                    }}
                    placeholder="創作者名稱"
                  />
                </>
              ) : (
                <>
                  <h1
                    className="text-3xl sm:text-4xl font-bold mb-2"
                    style={{
                      fontFamily: "'Noto Serif TC', serif",
                      color: "#5a4a3a",
                    }}
                  >
                    {editData.title || `第 ${workId} 組作品`}
                  </h1>
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      color: "#6b5d4f",
                      fontWeight: "500",
                    }}
                  >
                    創作者：{editData.author || "待公布"}
                  </p>
                </>
              )}
            </div>

            {/* 圖片區 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* 圖片 1 */}
              <div
                className="aspect-square rounded-sm overflow-hidden"
                style={{
                  background: "rgba(232, 223, 210, 0.5)",
                  border: "2px solid #8b7355",
                }}
              >
                {editData.image1Url ? (
                  <img
                    src={editData.image1Url}
                    alt="作品圖片 1"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ color: "#8b7355" }}
                  >
                    {isEditing ? "點擊上傳圖片 1" : "暫無圖片"}
                  </div>
                )}
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 1)}
                    className="hidden"
                    id="image1-input"
                  />
                )}
                {isEditing && (
                  <label
                    htmlFor="image1-input"
                    className="absolute inset-0 cursor-pointer"
                  />
                )}
              </div>

              {/* 圖片 2 */}
              <div
                className="aspect-square rounded-sm overflow-hidden"
                style={{
                  background: "rgba(232, 223, 210, 0.5)",
                  border: "2px solid #8b7355",
                }}
              >
                {editData.image2Url ? (
                  <img
                    src={editData.image2Url}
                    alt="作品圖片 2"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ color: "#8b7355" }}
                  >
                    {isEditing ? "點擊上傳圖片 2" : "暫無圖片"}
                  </div>
                )}
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 2)}
                    className="hidden"
                    id="image2-input"
                  />
                )}
                {isEditing && (
                  <label
                    htmlFor="image2-input"
                    className="absolute inset-0 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* 文案區 */}
            <div>
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
                    setEditData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-sm"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#5a4a3a",
                    minHeight: "300px",
                    fontSize: "16px",
                    lineHeight: "1.8",
                  }}
                  placeholder="輸入作品介紹文案..."
                />
              ) : (
                <p
                  className="text-base leading-relaxed"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#5a4a3a",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.8",
                    minHeight: "200px",
                  }}
                >
                  {editData.description || "暫無介紹文案"}
                </p>
              )}
            </div>

            {/* 保存按鈕 */}
            {isEditing && (
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-sm"
                  style={{
                    background: "#8b7355",
                    color: "#fff",
                    fontFamily: "'Noto Sans TC', sans-serif",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  保存變更
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-sm"
                  style={{
                    background: "rgba(139, 115, 85, 0.2)",
                    color: "#5a4a3a",
                    fontFamily: "'Noto Sans TC', sans-serif",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
