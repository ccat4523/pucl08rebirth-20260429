/**
 * Home Page - 蛻生畢展
 * Design: 報紙風格 × 古典文學
 * Features: 報紙底板、蝴蝶、書籍、手的意象
 */

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditableWorkCard from "@/components/EditableWorkCard";
import VideoCarousel from "@/components/VideoCarousel";
import ShareButtons from "@/components/ShareButtons";
import { trpc } from "@/lib/trpc";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const infoSection = useInView();
  const sharingSection = useInView();
  const worksSection = useInView();

  // 獲取所有作品數據
  const { data: allWorks = [] } = trpc.works.list.useQuery();

  // 獲取宣傳片數據
  const { data: videos = [] } = trpc.promotionalVideos.list.useQuery();

  // 宣傳片編輯狀態
  const [editingPromo, setEditingPromo] = useState(false);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoUrl, setPromoUrl] = useState("");
  const [promoFile, setPromoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastSavedPromo, setLastSavedPromo] = useState<string>("");
  const [isSavingPromo, setIsSavingPromo] = useState(false);
  const updatePromoMutation = trpc.promotionalVideos.update.useMutation();

  // 初始化編輯表單
  useEffect(() => {
    if (videos.length > 0 && editingPromo) {
      setPromoTitle(videos[0].title || "");
      setPromoUrl(videos[0].videoUrl || "");
    }
  }, [editingPromo, videos]);

  // 宣傳片自動儲存
  useEffect(() => {
    if (!editingPromo || videos.length === 0) return;
    
    const autoSaveTimer = setTimeout(async () => {
      if (promoTitle !== videos[0].title || promoUrl !== videos[0].videoUrl) {
        try {
          setIsSavingPromo(true);
          await updatePromoMutation.mutateAsync({
            id: videos[0].id,
            title: promoTitle,
            videoUrl: promoUrl,
          });
          setLastSavedPromo(new Date().toLocaleTimeString("zh-TW"));
        } catch (error) {
          console.error("宣傳片自動儲存失敗", error);
        } finally {
          setIsSavingPromo(false);
        }
      }
    }, 2000); // 2 秒後自動儲存

    return () => clearTimeout(autoSaveTimer);
  }, [promoTitle, promoUrl, editingPromo, videos]);


  // 示例作品數據（17個）
  const works = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    title: `作品 ${i + 1}`,
    author: `創作者 ${i + 1}`,
  }));

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

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(212, 197, 176, 0.7) 0%, rgba(212, 197, 176, 0.5) 50%, rgba(212, 197, 176, 0.7) 100%)",
        }}
      >
        {/* 頂部蝴蝶和手 */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/hands_butterfly-82t2QECvULcYdbgUGVUnLa.webp"
            alt="手中的蝴蝶"
            className="w-full object-contain"
            style={{
              filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))",
              animation: "float 5s ease-in-out infinite",
            }}
          />
        </div>

        {/* 主要內容 */}
        <div className="relative z-10 flex flex-col items-center text-center mt-32 sm:mt-40">
          {/* 蛻生標題 */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              letterSpacing: "0.15em",
            }}
          >
            蛻　生
          </h1>

          {/* 副標題 */}
          <p
            className="text-lg sm:text-xl md:text-2xl mb-8"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#8b7355",
              fontWeight: "300",
              letterSpacing: "0.05em",
            }}
          >
            靜宜大學中國文學系第八屆畢業展覽
          </p>

          {/* 分享按鈕 */}
          <div className="mb-8">
            <ShareButtons
              title="蛻生 - 靜宜大學中國文學系第八屆畢業展覽"
              description="一千五百個日升中，指尖已結出新繭；而當遍撤的種子萌芽，我將振翅高飛。"
              imageUrl="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/hands_butterfly-82t2QECvULcYdbgUGVUnLa.webp"
              url={window.location.origin}
            />
          </div>

          {/* 展覽信息框 */}
          <div
            className="mt-8 p-8 sm:p-10 rounded-sm max-w-2xl relative"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "3px solid #8b7355",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* 左上角裝飾 */}
            <div className="absolute -top-3 -left-3 w-6 h-6" style={{ background: "rgba(255, 255, 255, 0.9)", border: "2px solid #8b7355", transform: "rotate(45deg)" }} />
            {/* 右下角裝飾 */}
            <div className="absolute -bottom-3 -right-3 w-6 h-6" style={{ background: "rgba(255, 255, 255, 0.9)", border: "2px solid #8b7355", transform: "rotate(45deg)" }} />
            
            <div className="space-y-6 text-center">
              <div className="pb-4 border-b-2 border-gray-200">
                <p style={{ color: "#8b7355", fontWeight: "600", fontSize: "1rem", letterSpacing: "0.05em" }}>展覽日期</p>
                <p style={{ color: "#5a4a3a", fontSize: "1.3rem", fontWeight: "500", marginTop: "0.5rem" }}>2026年5月12日（二）– 5月14日（四）</p>
              </div>
              <div className="pb-4 border-b-2 border-gray-200">
                <p style={{ color: "#8b7355", fontWeight: "600", fontSize: "1rem", letterSpacing: "0.05em" }}>🕙 開放時間</p>
                <p style={{ color: "#5a4a3a", fontSize: "1.3rem", fontWeight: "500", marginTop: "0.5rem" }}>09:00 – 16:00</p>
              </div>
              <div>
                <p style={{ color: "#8b7355", fontWeight: "600", fontSize: "1rem", letterSpacing: "0.05em" }}>📍 展覽地點</p>
                <p style={{ color: "#5a4a3a", fontSize: "1.3rem", fontWeight: "500", marginTop: "0.5rem" }}>靜宜大學宜園餐廳樓上iDO培力基地</p>
              </div>
            </div>
          </div>

          {/* 引言 */}
          <p
            className="mt-12 max-w-2xl italic text-sm sm:text-base"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#6b5d4f",
              lineHeight: "1.8",
            }}
          >
            「一千五百個日升中，指尖已結出新繭；而當遍撤的種子萌芽，我將振翅高飛。」
          </p>
        </div>

        {/* 向下箭頭 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" style={{ color: "#5a4a3a" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* 底部白色考卷裝飾 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
          {/* 左側考卷 */}
          <div
            className="absolute -bottom-8 -left-12 w-48 h-56 opacity-30"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "2px solid #d4a574",
              transform: "rotate(-15deg)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
          {/* 右側考卷 */}
          <div
            className="absolute -bottom-12 -right-16 w-56 h-64 opacity-25"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              border: "2px solid #d4a574",
              transform: "rotate(20deg)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
          {/* 中間考卷 */}
          <div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-48 opacity-20"
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              border: "2px solid #d4a574",
              transform: "translateX(-50%) rotate(8deg)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>
      </section>

      {/* ===== INFO SECTION ===== */}
      <section
        id="info"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.6) 0%, rgba(232, 223, 210, 0.8) 100%)",
        }}
      >
        <div
          ref={infoSection.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            infoSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
            }}
          >
            關於「蛻生」
          </h2>

          <div
            className="p-6 sm:p-8 rounded-sm"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "2px solid #8b7355",
            }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#6b5d4f",
                lineHeight: "1.8",
              }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "#5a4a3a" }}>蛻，從經驗深處，綻放新生。</span>
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed mt-4"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#6b5d4f",
                lineHeight: "1.8",
              }}
            >
              我們以中國文學的深厚土壤為根基，澆灌當代思維的活水，蛻變成兼具文化涵養與創新能量的創作靈魂。
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed mt-4"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#6b5d4f",
                lineHeight: "1.8",
              }}
            >
              這次畢業展，17位同學、17種創作語彙，各自以不同的姿態，訴說屬於我們的故事。
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed mt-4"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#6b5d4f",
                lineHeight: "1.8",
              }}
            >
              每一件作品，都是一場發現之旅；每一位創作者，都值得在聚光下被看見。
            </p>
          </div>
        </div>
      </section>

      {/* ===== PROMOTIONAL VIDEO SECTION ===== */}
      <section
        id="promo"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.6) 0%, rgba(232, 223, 210, 0.8) 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
            }}
          >
            宣傳片
          </h2>

          {/* 只顯示第一個宣傳片 */}
          <div className="flex justify-center">
            <div style={{ maxWidth: "400px", width: "100%" }}>
            {editingPromo ? (
              // 編輯模式
              <div
                className="p-6 rounded-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "2px solid #8b7355",
                }}
              >
                <h3 className="text-xl font-bold mb-4" style={{ color: "#5a4a3a" }}>
                  編輯宣傳片
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#5a4a3a" }}>
                      標題
                    </label>
                    <input
                      type="text"
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      style={{ borderColor: "#8b7355" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#5a4a3a" }}>
                      影片 URL
                    </label>
                    <input
                      type="text"
                      value={promoUrl}
                      onChange={(e) => setPromoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2 border rounded"
                      style={{ borderColor: "#8b7355" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#5a4a3a" }}>
                      上傳影片檔案
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setPromoFile(e.target.files?.[0] || null)}
                      className="w-full"
                    />
                  </div>
                  <div
                    className="p-3 rounded-sm text-sm"
                    style={{
                      background: "rgba(212, 165, 116, 0.1)",
                      color: "#8b7355",
                    }}
                  >
                    {isSavingPromo ? "儲存中..." : lastSavedPromo ? `最後儲存時間：${lastSavedPromo}` : "未儲存"}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setEditingPromo(false);
                        setPromoFile(null);
                      }}
                      className="px-4 py-2 rounded"
                      style={{
                        background: "#e8dfd2",
                        color: "#5a4a3a",
                        border: "1px solid #8b7355",
                      }}
                    >
                      取消
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          let finalUrl = promoUrl;
                          if (promoFile) {
                            setUploading(true);
                            const formData = new FormData();
                            formData.append("file", promoFile);
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const data = await res.json();
                            finalUrl = data.url;
                            setUploading(false);
                          }
                          await updatePromoMutation.mutateAsync({
                            id: videos[0].id,
                            title: promoTitle,
                            videoUrl: finalUrl,
                          });
                          setEditingPromo(false);
                          setPromoFile(null);
                        } catch (error) {
                          console.error("保存失敗", error);
                          setUploading(false);
                        }
                      }}
                      disabled={updatePromoMutation.isPending || uploading}
                      className="px-4 py-2 rounded text-white"
                      style={{
                        background: "#d4a574",
                      }}
                    >
                      {updatePromoMutation.isPending || uploading ? "保存中..." : "保存"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 顯示模式
              videos.length > 0 && videos[0].videoUrl && (
                <div
                  className="p-6 rounded-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    border: "2px solid #8b7355",
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "'Noto Serif TC', serif",
                        color: "#5a4a3a",
                      }}
                    >
                      {videos[0].title || "宣傳片"}
                    </h3>
                    {isAuthenticated && user?.role === "admin" && (
                      <button
                        onClick={() => setEditingPromo(true)}
                        className="px-3 py-1 rounded text-sm"
                        style={{
                          background: "#d4a574",
                          color: "white",
                        }}
                      >
                        編輯
                      </button>
                    )}
                  </div>
                  <div style={{ aspectRatio: "9/16", overflow: "hidden", borderRadius: "0.125rem" }}>
                    <iframe
                      src={videos[0].videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              )
            )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WORKS SECTION ===== */}
      <section
        id="works"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.6) 0%, rgba(232, 223, 210, 0.8) 100%)",
        }}
      >
        <div
          ref={worksSection.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            worksSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
            }}
          >
            作品展示
          </h2>

          {/* 小組作品卡片網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allWorks
              .filter((work: any) => work.image1Url) // 只顯示有圖片的作品
              .map((work: any, index: number) => (
              <a
                key={work.id}
                href={`/work/${work.id}`}
                className="rounded-sm transition-all duration-300 hover:shadow-lg block overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "2px solid #8b7355",
                  animationDelay: `${index * 0.1}s`,
                  textDecoration: "none",
                }}
              >
                {/* 圖片預覽 */}
                {work.image1Url && (
                  <div
                    className="w-full overflow-hidden"
                    style={{
                      height: "200px",
                      background: "rgba(200, 180, 160, 0.3)",
                    }}
                  >
                    <img
                      src={work.image1Url}
                      alt={work.title || `第 ${work.workNumber} 組`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 文字內容 */}
                <div className="p-6">
                  {/* 大標題：組別名稱 */}
                  <h4
                    className="text-xl sm:text-2xl font-bold mb-2"
                    style={{
                      fontFamily: "'Noto Serif TC', serif",
                      color: "#5a4a3a",
                    }}
                  >
                    {work.title || `第 ${work.workNumber} 組作品`}
                  </h4>
                  {/* 子標題：組別 */}
                  <p
                    className="text-sm sm:text-base mb-4"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      color: "#8b7355",
                      fontWeight: "600",
                    }}
                  >
                    第 {work.workNumber} 組
                  </p>
                  {/* 短介紹：約 30 字 */}
                  <p
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      color: "#6b5d4f",
                      lineHeight: "1.6",
                    }}
                  >
                    {work.description || "敬請期待..."}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}
