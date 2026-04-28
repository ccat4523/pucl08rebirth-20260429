/**
 * Admin Panel - 管理員後台系統
 * 功能：編輯宣傳片、各組照片、文案
 * 特性：倒退、自動儲存、補全資訊
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"promo" | "works" | "content">("promo");
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
          {/* 返回主頁按鈕 */}
          <div className="mb-8">
            <a
              href="/"
              className="inline-block px-4 py-2 rounded-sm font-bold transition-all"
              style={{
                background: "#d4a574",
                color: "white",
                textDecoration: "none",
              }}
            >
              ← 返回主頁（查看外界視角）
            </a>
          </div>

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
              onClick={() => {
                setActiveTab("promo");
                setSelectedWorkId(null);
              }}
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
              onClick={() => {
                setActiveTab("works");
                setSelectedWorkId(null);
              }}
              className="px-6 py-2 rounded-sm font-bold transition-all"
              style={{
                background: activeTab === "works" ? "#d4a574" : "rgba(255, 255, 255, 0.7)",
                color: activeTab === "works" ? "white" : "#5a4a3a",
                border: "2px solid #8b7355",
              }}
            >
              作品管理
            </button>
            <button
              onClick={() => {
                setActiveTab("content");
                setSelectedWorkId(null);
              }}
              className="px-6 py-2 rounded-sm font-bold transition-all"
              style={{
                background: activeTab === "content" ? "#d4a574" : "rgba(255, 255, 255, 0.7)",
                color: activeTab === "content" ? "white" : "#5a4a3a",
                border: "2px solid #8b7355",
              }}
            >
              文案管理
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
                <AdminPromoEditor video={videos[0]} />
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

              {selectedWorkId ? (
                <AdminWorkEditor 
                  workId={selectedWorkId} 
                  onBack={() => setSelectedWorkId(null)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allWorks.map((work: any) => (
                    <button
                      key={work.id}
                      onClick={() => setSelectedWorkId(work.id)}
                      className="p-4 rounded-sm text-left transition-all hover:shadow-lg"
                      style={{
                        background: "rgba(200, 180, 160, 0.3)",
                        border: "2px solid #8b7355",
                        color: "#5a4a3a",
                      }}
                    >
                      <p className="font-bold">{work.title || `第 ${work.workNumber} 組`}</p>
                      <p className="text-sm">創作者：{work.author || "待公布"}</p>
                      <p className="text-xs mt-2" style={{ color: "#a89080" }}>
                        {work.image1Url ? "✓ 已上傳圖片" : "✗ 未上傳圖片"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 文案管理 */}
          {activeTab === "content" && (
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
                文案管理
              </h2>
              <AdminContentEditor />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function AdminPromoEditor({ video }: { video: any }) {
  const updateMutation = trpc.promotionalVideos.update.useMutation();
  
  const [promoTitle, setPromoTitle] = useState(video.title || "");
  const [promoUrl, setPromoUrl] = useState(video.videoUrl || "");
  const [promoFile, setPromoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // 自動儲存
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (promoTitle !== video.title || promoUrl !== video.videoUrl) {
        try {
          setIsSaving(true);
          await updateMutation.mutateAsync({
            id: video.id,
            title: promoTitle,
            videoUrl: promoUrl,
          });
          setLastSaved(new Date().toLocaleTimeString("zh-TW"));
        } catch (error) {
          console.error("自動儲存失敗", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000); // 2 秒後自動儲存

    return () => clearTimeout(autoSaveTimer);
  }, [promoTitle, promoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPromoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!promoFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", promoFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setPromoUrl(url);
        setPromoFile(null);
      }
    } catch (error) {
      alert("上傳失敗");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>標題</label>
        <input
          type="text"
          value={promoTitle}
          onChange={(e) => setPromoTitle(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          style={{ borderColor: "#8b7355" }}
          placeholder="宣傳片標題"
        />
      </div>

      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>影片 URL</label>
        <input
          type="text"
          value={promoUrl}
          onChange={(e) => setPromoUrl(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          style={{ borderColor: "#8b7355" }}
          placeholder="輸入影片 URL 或上傳檔案"
        />
      </div>

      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>上傳影片檔案</label>
        <div className="flex gap-2 mt-2">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="flex-1 p-2 border rounded"
            style={{ borderColor: "#8b7355" }}
          />
          <button
            onClick={handleUpload}
            disabled={!promoFile || isUploading}
            className="px-4 py-2 rounded-sm font-bold"
            style={{
              background: !promoFile || isUploading ? "#ccc" : "#d4a574",
              color: "white",
            }}
          >
            {isUploading ? "上傳中..." : "上傳"}
          </button>
        </div>
      </div>

      <div
        className="p-3 rounded-sm text-sm"
        style={{
          background: "rgba(212, 165, 116, 0.1)",
          color: "#8b7355",
        }}
      >
        {isSaving ? "儲存中..." : lastSaved ? `最後儲存時間：${lastSaved}` : "未儲存"}
      </div>
    </div>
  );
}

function AdminWorkEditor({ workId, onBack }: { workId: number; onBack: () => void }) {
  const { data: work } = trpc.works.getById.useQuery(workId);
  const updateMutation = trpc.works.update.useMutation();

  const [editData, setEditData] = useState({
    title: "",
    author: "",
    description: "",
    image1Url: "",
    image2Url: "",
  });
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

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

  // 自動儲存
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (
        editData.title !== work?.title ||
        editData.author !== work?.author ||
        editData.description !== work?.description ||
        editData.image1Url !== work?.image1Url ||
        editData.image2Url !== work?.image2Url
      ) {
        try {
          setIsSaving(true);
          await updateMutation.mutateAsync({
            id: workId,
            title: editData.title,
            author: editData.author,
            description: editData.description,
            image1Url: editData.image1Url,
            image2Url: editData.image2Url,
          });
          setLastSaved(new Date().toLocaleTimeString("zh-TW"));
        } catch (error) {
          console.error("自動儲存失敗", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [editData, work?.title, work?.author, work?.description, work?.image1Url, work?.image2Url]);

  const handleImageChange = (imageNum: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageNum === 1) {
        setImageFile1(file);
      } else {
        setImageFile2(file);
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditData({
          ...editData,
          [imageNum === 1 ? "image1Url" : "image2Url"]: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async (imageNum: 1 | 2) => {
    const imageFile = imageNum === 1 ? imageFile1 : imageFile2;
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
          [imageNum === 1 ? "image1Url" : "image2Url"]: url,
        });
        if (imageNum === 1) {
          setImageFile1(null);
        } else {
          setImageFile2(null);
        }
      }
    } catch (error) {
      alert("上傳失敗");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      {/* 返回按鈕 */}
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 rounded-sm"
        style={{
          background: "#d4a574",
          color: "white",
          fontWeight: "600",
        }}
      >
        ← 返回列表
      </button>

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
          編輯作品：{editData.title || `第 ${work?.workNumber} 組`}
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
              placeholder="作品標題"
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
              placeholder="創作者名稱"
            />
          </div>

          <div>
            <label style={{ color: "#8b7355", fontWeight: "600" }}>詳細介紹（500 字以內）</label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description: e.target.value.slice(0, 1000),
                })
              }
              className="w-full p-2 border rounded mt-1"
              style={{ borderColor: "#8b7355", minHeight: "200px" }}
              maxLength={1000}
              placeholder="請輸入作品的詳細介紹（500 字以內）"
            />
            <p style={{ color: "#a89080", fontSize: "0.9rem", marginTop: "0.5rem" }}>
              {editData.description.length} / 1000 字（建議 500 字）
            </p>
          </div>

          {/* 第一張圖片 */}
          <div>
            <label style={{ color: "#8b7355", fontWeight: "600" }}>圖片 1</label>
            {editData.image1Url && (
              <div className="mt-2 mb-4">
                <img
                  src={editData.image1Url}
                  alt="預覽 1"
                  className="w-full max-w-xs rounded"
                  style={{ border: "2px solid #8b7355" }}
                />
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(1, e)}
                className="flex-1 p-2 border rounded"
                style={{ borderColor: "#8b7355" }}
              />
              <button
                onClick={() => handleUploadImage(1)}
                disabled={!imageFile1 || isUploading}
                className="px-4 py-2 rounded-sm font-bold whitespace-nowrap"
                style={{
                  background: !imageFile1 || isUploading ? "#ccc" : "#d4a574",
                  color: "white",
                }}
              >
                {isUploading ? "上傳中..." : "上傳"}
              </button>
            </div>
          </div>

          {/* 第二張圖片 */}
          <div>
            <label style={{ color: "#8b7355", fontWeight: "600" }}>圖片 2</label>
            {editData.image2Url && (
              <div className="mt-2 mb-4">
                <img
                  src={editData.image2Url}
                  alt="預覽 2"
                  className="w-full max-w-xs rounded"
                  style={{ border: "2px solid #8b7355" }}
                />
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(2, e)}
                className="flex-1 p-2 border rounded"
                style={{ borderColor: "#8b7355" }}
              />
              <button
                onClick={() => handleUploadImage(2)}
                disabled={!imageFile2 || isUploading}
                className="px-4 py-2 rounded-sm font-bold whitespace-nowrap"
                style={{
                  background: !imageFile2 || isUploading ? "#ccc" : "#d4a574",
                  color: "white",
                }}
              >
                {isUploading ? "上傳中..." : "上傳"}
              </button>
            </div>
          </div>

          <div
            className="p-3 rounded-sm text-sm"
            style={{
              background: "rgba(212, 165, 116, 0.1)",
              color: "#8b7355",
            }}
          >
            {isSaving ? "儲存中..." : lastSaved ? `最後儲存時間：${lastSaved}` : "未儲存"}
          </div>
        </div>
      </div>
    </div>
  );
}


function AdminContentEditor() {
  const [content, setContent] = useState({
    aboutTitle: "關於蛻生",
    aboutDescription: "這次畢業展，17組同學、17種創作語彙，各自以不同的姿態，訴說屬於我們的故事。",
    aboutSubtitle: "每一件作品，都是一場發現之旅；每一位創作者，都值得在聚光下被看見。",
    worksTitle: "作品展示",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // 這裡可以添加保存到後端的邏輯
      // 暫時只保存到 localStorage
      localStorage.setItem("pageContent", JSON.stringify(content));
      setLastSaved(new Date().toLocaleTimeString("zh-TW"));
    } catch (error) {
      alert("保存失敗");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>「關於蛻生」標題</label>
        <input
          type="text"
          value={content.aboutTitle}
          onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          style={{ borderColor: "#8b7355" }}
        />
      </div>

      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>「關於蛻生」主要描述</label>
        <textarea
          value={content.aboutDescription}
          onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          style={{ borderColor: "#8b7355", minHeight: "100px" }}
        />
      </div>

      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>「關於蛻生」副標題</label>
        <textarea
          value={content.aboutSubtitle}
          onChange={(e) => setContent({ ...content, aboutSubtitle: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          style={{ borderColor: "#8b7355", minHeight: "80px" }}
        />
      </div>

      <div>
        <label style={{ color: "#8b7355", fontWeight: "600" }}>「作品展示」標題</label>
        <input
          type="text"
          value={content.worksTitle}
          onChange={(e) => setContent({ ...content, worksTitle: e.target.value })}
          className="w-full p-2 border rounded mt-1"
          style={{ borderColor: "#8b7355" }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 rounded-sm font-bold"
          style={{
            background: isSaving ? "#ccc" : "#d4a574",
            color: "white",
          }}
        >
          {isSaving ? "保存中..." : "保存文案"}
        </button>
      </div>

      <div
        className="p-3 rounded-sm text-sm"
        style={{
          background: "rgba(212, 165, 116, 0.1)",
          color: "#8b7355",
        }}
      >
        {isSaving ? "保存中..." : lastSaved ? `最後儲存時間：${lastSaved}` : "未儲存"}
      </div>

      <div
        className="p-4 rounded-sm"
        style={{
          background: "rgba(200, 180, 160, 0.2)",
          border: "1px solid #8b7355",
        }}
      >
        <p style={{ color: "#5a4a3a", fontWeight: "600", marginBottom: "0.5rem" }}>預覽：</p>
        <div style={{ color: "#6b5d4f", fontSize: "0.9rem", lineHeight: "1.6" }}>
          <p><strong>{content.aboutTitle}</strong></p>
          <p>{content.aboutDescription}</p>
          <p style={{ marginTop: "0.5rem" }}>{content.aboutSubtitle}</p>
          <p style={{ marginTop: "1rem" }}><strong>{content.worksTitle}</strong></p>
        </div>
      </div>
    </div>
  );
}
