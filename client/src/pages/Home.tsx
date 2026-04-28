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

  // 示例作品數據（17個）
  const works = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    title: `作品 ${i + 1}`,
    author: `創作者 ${i + 1}`,
  }));

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* 宇宙背景圖 */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/hero_bg-LjGbvRxeFf7WoyXK7c7pHg.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* 深色遮罩讓背景更深沉 */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: "linear-gradient(180deg, rgba(13,6,32,0.4) 0%, rgba(13,6,32,0.2) 50%, rgba(13,6,32,0.7) 100%)",
          }}
        />
        {/* 頂部聚光燈光暈 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] z-[2]"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(138, 92, 246, 0.25) 0%, transparent 65%)",
          }}
        />

        {/* 主要內容 */}
        <div className="relative z-[10] flex flex-col items-center text-center">
          {/* 蛻生標題 */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#ffffff",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              letterSpacing: "0.15em",
            }}
          >
            蛻　生
          </h1>

          {/* 副標題 */}
          <p
            className="text-lg sm:text-xl mt-4 mb-8"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#e0e0e0",
              fontWeight: "300",
              letterSpacing: "0.05em",
            }}
          >
            靜宜大學中國文學系第八屆畢業成果展
          </p>

          {/* 日期和地點 */}
          <div
            className="mt-8 px-6 py-4 rounded-sm"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <p
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#e0e0e0",
                fontSize: "14px",
              }}
            >
              2025年 | 靜宜大學
            </p>
          </div>

          {/* 向下箭頭 */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <svg
              className="w-6 h-6"
              style={{
                color: "#ffffff",
                animation: "bounce 2s infinite",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.6) 0%, rgba(232, 223, 210, 0.8) 100%)",
        }}
      >
        <div
          ref={infoSection.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
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
            className="p-8 sm:p-10 rounded-sm"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "2px solid #8b7355",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed mb-6"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#5a4a3a",
              }}
            >
              「蛻生」象徵著從舊我蛻變到新我，從文學的沉思到現實的綻放。中國文學系第八屆的同學們，在四年的學習中，汲取古典文學的精華，融合現代創意的思維，蛻變成為具有文化涵養與創新精神的新世代文化工作者。
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#5a4a3a",
              }}
            >
              這次畢業成果展，我們將展現17位同學的創意作品，透過不同的表現形式，訴說屬於我們的故事。每一件作品都是一次蛻變，每一位創作者都值得被看見。
            </p>
          </div>
        </div>
      </section>

      {/* ===== SMALL GROUP SHARING SECTION ===== */}
      <section
        id="sharing"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.6) 0%, rgba(232, 223, 210, 0.8) 100%)",
        }}
      >
        <div
          ref={sharingSection.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            sharingSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
            }}
          >
            小組分享
          </h2>

          {/* 小組介紹卡片網格 - 單張圖片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allWorks.map((work: any, index: number) => (
              <a
                key={work.id}
                href={`/work/${work.id}`}
                className="rounded-sm transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer block overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "2px solid #8b7355",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* 圖片區域 */}
                <div
                  className="w-full aspect-square overflow-hidden"
                  style={{
                    background: "rgba(232, 223, 210, 0.5)",
                  }}
                >
                  {work.image1Url ? (
                    <img
                      src={work.image1Url}
                      alt={work.title || `第 ${work.workNumber} 組`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ color: "#8b7355" }}
                    >
                      暫無圖片
                    </div>
                  )}
                </div>

                {/* 文字區域 */}
                <div className="p-4">
                  <h3
                    className="text-lg sm:text-xl font-bold mb-1"
                    style={{
                      fontFamily: "'Noto Serif TC', serif",
                      color: "#5a4a3a",
                    }}
                  >
                    {work.title || `第 ${work.workNumber} 組`}
                  </h3>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      fontFamily: "'Noto Sans TC', sans-serif",
                      color: "#6b5d4f",
                      fontWeight: "500",
                    }}
                  >
                    {work.author || "待公布"}
                  </p>
                </div>
              </a>
            ))}
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

          {/* 影片展示區 */}
          <VideoCarousel />

          {/* 翻書動畫網格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work, index) => (
              <div key={work.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <EditableWorkCard
                  id={work.id}
                  workNumber={work.id}
                  initialTitle={work.title}
                  initialAuthor={work.author}
                />
              </div>
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
