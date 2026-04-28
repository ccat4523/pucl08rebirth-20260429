/**
 * Admin Panel - 管理員後台系統
 * 功能：編輯宣傳片、各組照片、文案
 * 權限：只有管理員可訪問
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"promo" | "works">("promo");
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);

  // 獲取所有作品
  const { data: allWorks = [] } = trpc.works.list.useQuery();
  
  // 獲取宣傳片
  const { data: videos = [] } = trpc.promotionalVideos.list.useQuery();

  // 檢查是否為管理員
  const isAdmin = isAuthenticated && user?.role === "admin";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#e8dfd2" }}>
        <div className="text-center">
          <h1 style={{ color: "#5a4a3a", marginBottom: "1rem" }}>請登入</h1>
          <p style={{ color: "#6b5d4f" }}>需要管理員權限才能訪問此頁面</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#e8dfd2" }}>
        <div className="text-center">
          <h1 style={{ color: "#5a4a3a", marginBottom: "1rem" }}>訪問被拒</h1>
          <p style={{ color: "#6b5d4f" }}>只有管理員可以訪問此頁面</p>
        </div>
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

      {/* ===== ADMIN PANEL ===== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-4xl font-bold text-center mb-12"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
            }}
          >
            管理員後台
          </h1>

          {/* 標籤頁 */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => setActiveTab("promo")}
              className="px-6 py-2 rounded-sm font-bold transition-all"
              style={{
                background: activeTab === "promo" ? "#d4a574" : "rgba(255, 255, 255, 0.7)",
                color: activeTab === "promo" ? "white" : "#5a4a3a",
                border: "2px solid #8b7355",
              }}
            >
              宣傳片管理
            </button>
            <button
              onClick={() => setActiveTab("works")}
              className="px-6 py-2 rounded-sm font-bold transition-all"
              style={{
                background: activeTab === "works" ? "#d4a574" : "rgba(255, 255, 255, 0.7)",
                color: activeTab === "works" ? "white" : "#5a4a3a",
                border: "2px solid #8b7355",
              }}
            >
              作品管理
            </button>
          </div>

          {/* 宣傳片管理 */}
          {activeTab === "promo" && (
            <div
              className="p-8 rounded-sm"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #8b7355",
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Noto Serif TC', serif",
                  color: "#5a4a3a",
                }}
              >
                宣傳片管理
              </h2>
              {videos.length > 0 ? (
                <div>
                  <p style={{ color: "#6b5d4f", marginBottom: "1rem" }}>
                    標題：{videos[0].title || "未設置"}
                  </p>
                  <p style={{ color: "#6b5d4f", marginBottom: "1rem" }}>
                    影片 URL：{videos[0].videoUrl || "未設置"}
                  </p>
                  <a
                    href="/"
                    className="inline-block px-4 py-2 rounded-sm"
                    style={{
                      background: "#d4a574",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    編輯宣傳片
                  </a>
                </div>
              ) : (
                <p style={{ color: "#6b5d4f" }}>暫無宣傳片</p>
              )}
            </div>
          )}

          {/* 作品管理 */}
          {activeTab === "works" && (
            <div
              className="p-8 rounded-sm"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #8b7355",
              }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: "'Noto Serif TC', serif",
                  color: "#5a4a3a",
                }}
              >
                作品管理
              </h2>

              {/* 作品列表 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {allWorks.map((work: any) => (
                  <button
                    key={work.id}
                    onClick={() => setSelectedWorkId(work.id)}
                    className="p-4 rounded-sm text-left transition-all"
                    style={{
                      background:
                        selectedWorkId === work.id
                          ? "#d4a574"
                          : "rgba(200, 180, 160, 0.3)",
                      border: "2px solid #8b7355",
                      color: selectedWorkId === work.id ? "white" : "#5a4a3a",
                    }}
                  >
                    <p className="font-bold">{work.title || `第 ${work.workNumber} 組`}</p>
                    <p className="text-sm">創作者：{work.author || "待公布"}</p>
                  </button>
                ))}
              </div>

              {/* 編輯區 */}
              {selectedWorkId && (
                <AdminWorkEditor workId={selectedWorkId} />
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function AdminWorkEditor({ workId }: { workId: number }) {
  const { data: work } = trpc.works.getById.useQuery(workId);
  const updateMutation = trpc.works.update.useMutation();

  const [editData, setEditData] = useState({
    title: "",
    author: "",
    description: "",
    image1Url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    try {
      setIsUploading(true);

      let finalImageUrl = editData.image1Url;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          finalImageUrl = url;
        }
      }

      await updateMutation.mutateAsync({
        id: workId,
        title: editData.title,
        author: editData.author,
        description: editData.description,
        image1Url: finalImageUrl,
      });

      setImageFile(null);
      alert("作品已更新");
    } catch (error) {
      alert("更新失敗");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-sm"
      style={{
        background: "rgba(200, 180, 160, 0.2)",
        border: "2px dashed #8b7355",
      }}
    >
      <h3
        className="text-xl font-bold mb-4"
        style={{
          fontFamily: "'Noto Serif TC', serif",
          color: "#5a4a3a",
        }}
      >
        編輯作品
      </h3>

      <div className="space-y-4">
        <div>
          <label style={{ color: "#8b7355", fontWeight: "600" }}>標題</label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full p-2 border rounded mt-1"
            style={{ borderColor: "#8b7355" }}
          />
        </div>

        <div>
          <label style={{ color: "#8b7355", fontWeight: "600" }}>創作者</label>
          <input
            type="text"
            value={editData.author}
            onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            className="w-full p-2 border rounded mt-1"
            style={{ borderColor: "#8b7355" }}
          />
        </div>

        <div>
          <label style={{ color: "#8b7355", fontWeight: "600" }}>介紹（100 字以內）</label>
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({
                ...editData,
                description: e.target.value.slice(0, 200),
              })
            }
            className="w-full p-2 border rounded mt-1"
            style={{ borderColor: "#8b7355", minHeight: "100px" }}
            maxLength={200}
          />
          <p style={{ color: "#a89080", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            {editData.description.length} / 200 字
          </p>
        </div>

        <div>
          <label style={{ color: "#8b7355", fontWeight: "600" }}>圖片</label>
          {editData.image1Url && (
            <div className="mt-2 mb-4">
              <img
                src={editData.image1Url}
                alt="預覽"
                className="w-full max-w-xs rounded"
                style={{ border: "2px solid #8b7355" }}
              />
            </div>
          )}
          <label
            className="block p-4 border-2 border-dashed rounded-sm text-center cursor-pointer mt-2"
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
            <p style={{ color: "#8b7355" }}>點擊上傳圖片</p>
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={isUploading}
          className="w-full p-3 rounded-sm font-bold"
          style={{
            background: isUploading ? "#ccc" : "#d4a574",
            color: "white",
          }}
        >
          {isUploading ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
