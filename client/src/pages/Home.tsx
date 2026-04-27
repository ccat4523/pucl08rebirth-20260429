/**
 * Home Page - 蛻生畢展
 * Design: 報紙風格 × 古典文學
 * Features: 報紙底板、蝴蝶、書籍、手的意象
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditableWorkCard from "@/components/EditableWorkCard";
import VideoCarousel from "@/components/VideoCarousel";

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
  const infoSection = useInView();
  const worksSection = useInView();

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
            className="text-base sm:text-lg md:text-xl mb-8"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#6b5d4f",
              fontWeight: "500",
            }}
          >
            靜宜大學中國文學系第八屆畢業展覽
          </p>

          {/* 展覽資訊卡片 */}
          <div
            className="p-6 sm:p-8 rounded-sm"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              border: "3px solid #8b7355",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              maxWidth: "500px",
            }}
          >
            <div
              className="space-y-3"
              style={{
                fontFamily: "'Noto Sans TC', sans-serif",
                color: "#5a4a3a",
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>▹展覽日期</span>
                <span>2026年5月12日（二）– 5月14日（四）</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>🕙 開放時間</span>
                <span>09:00 – 16:00</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>📍 展覽地點</span>
                <span>靜宜大學宜園餐廳樓上iDO培力基地</span>
              </div>
            </div>
          </div>

          {/* 引言文字 */}
          <div className="mt-12 max-w-2xl px-4">
            <p
              className="text-sm sm:text-base leading-relaxed italic"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "#6b5d4f",
                background: "rgba(255, 255, 255, 0.6)",
                padding: "1rem",
                borderLeft: "4px solid #8b7355",
              }}
            >
              「一千五百個日升中，筆尖已結出新蘭；而當撒撤的種子萌芽，我將振翅高飛。」
            </p>
          </div>
        </div>

        {/* 底部書籍和羽毛 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/open_book_feather-DhpZn5T8K5L6tMb9suYogY.webp"
            alt="打開的書籍"
            className="w-full object-contain opacity-70"
            style={{
              animation: "float 6s ease-in-out infinite reverse",
            }}
          />
        </div>
      </section>

      {/* ===== EXHIBITION INFO SECTION ===== */}
      <section
        id="info"
        className="py-20 px-4"
        style={{
          background: "linear-gradient(180deg, rgba(232, 223, 210, 0.8) 0%, rgba(232, 223, 210, 0.6) 100%)",
        }}
      >
        <div
          ref={infoSection.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            infoSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#5a4a3a",
            }}
          >
            「關於蛻生」
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
        @keyframes pageFlip {
          0% { transform: scaleX(1); }
          50% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
