/**
 * Work Detail Page - 小組作品詳情
 * Design: 報紙風格 × 古典文學
 * Features: 2 張圖片 + 大文案區（可編輯）
 */

import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
// import { useToast } from "@/components/ui/use-toast";

export default function WorkDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/work/:id");
  const workId = params?.id ? parseInt(params.id, 10) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    author: "",
    description: "",
  });

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
      });
    }
  }, [work]);

  const handleSave = async () => {
    if (!workId) return;

    try {
      await updateMutation.mutateAsync({
        id: workId,
        title: editData.title,
        author: editData.author,
        description: editData.description,
      });
      setIsEditing(false);
      alert("作品資訊已更新");
    } catch (error) {
      alert("更新失敗，請重試");
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
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.7) 0%, rgba(232, 223, 210, 0.9) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* 返回按鈕 */}
          <a
            href="/"
            className="inline-block mb-6 px-4 py-2 rounded-sm transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid #8b7355",
              color: "#5a4a3a",
              textDecoration: "none",
              fontFamily: "'Noto Sans TC', sans-serif",
            }}
          >
            ← 返回
          </a>

          {/* 作品卡片 */}
          <div
            className="p-8 rounded-sm"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #8b7355",
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
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full text-3xl font-bold mb-4 p-2 border rounded"
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

            {/* 2 張圖片並排 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div
                className="aspect-square flex items-center justify-center rounded-sm"
                style={{
                  background: "rgba(200, 180, 160, 0.3)",
                  border: "2px solid #8b7355",
                  minHeight: "300px",
                }}
              >
                {work.image1Url ? (
                  <img
                    src={work.image1Url}
                    alt="作品圖片 1"
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
              <div
                className="aspect-square flex items-center justify-center rounded-sm"
                style={{
                  background: "rgba(200, 180, 160, 0.3)",
                  border: "2px solid #8b7355",
                  minHeight: "300px",
                }}
              >
                {work.image2Url ? (
                  <img
                    src={work.image2Url}
                    alt="作品圖片 2"
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
            </div>

            {/* 大文案區 */}
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
                  className="w-full p-4 border rounded-sm min-h-[300px]"
                  style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    color: "#5a4a3a",
                    borderColor: "#8b7355",
                    lineHeight: "1.8",
                  }}
                  placeholder="輸入作品介紹文案..."
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
            </div>

            {/* 編輯按鈕 */}
            {user?.role === "admin" && (
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="px-6 py-2 rounded-sm font-bold transition-all"
                      style={{
                        background: "#d4a574",
                        color: "#ffffff",
                        border: "none",
                        cursor: updateMutation.isPending ? "not-allowed" : "pointer",
                        opacity: updateMutation.isPending ? 0.6 : 1,
                      }}
                    >
                      {updateMutation.isPending ? "保存中..." : "完成編輯"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          title: work.title || "",
                          author: work.author || "",
                          description: work.description || "",
                        });
                      }}
                      className="px-6 py-2 rounded-sm font-bold transition-all"
                      style={{
                        background: "rgba(255, 255, 255, 0.8)",
                        color: "#5a4a3a",
                        border: "1px solid #8b7355",
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
