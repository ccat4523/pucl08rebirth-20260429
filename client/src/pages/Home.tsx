/**
 * Home Page - 青春18LIGHT 主頁
 * Design: 深宇宙舞台美學 (Cosmic Stage Aesthetics)
 * Sections:
 *   1. Hero - 全螢幕深紫宇宙背景 + 3D Logo + 透視格線
 *   2. Tagline - 淺灰白背景，引言文字
 *   3. About - 深藍黑背景，品牌說明
 *   4. Features - 三欄卡片佈局（深色/圖片/白色）
 *   5. Video - YouTube 嵌入影片
 * Colors: #0d0620 deep purple, #1a1a2e navy, #f5f5f7 light gray, accent #8b5cf6
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const taglineSection = useInView();
  const aboutSection = useInView();
  const featuresSection = useInView();
  const videoSection = useInView();

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#0d0620" }}
    >
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
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16">
          {/* 3D Logo - 浮動動畫 */}
          <div
            className="mb-4"
            style={{
              animation: "float 4s ease-in-out infinite",
            }}
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/hero_logo_3d-DxybjeVg42v3CegTcWc2eD.png"
              alt="青春18LIGHT Logo"
              className="w-[260px] sm:w-[340px] md:w-[400px] lg:w-[460px] object-contain"
              style={{
                filter: "drop-shadow(0 0 50px rgba(138, 92, 246, 0.55))",
              }}
            />
          </div>

          {/* 主標題 */}
          <h1
            className="text-[2.8rem] sm:text-5xl md:text-6xl font-bold text-white mb-3"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              textShadow: "0 0 30px rgba(138, 92, 246, 0.5), 0 0 60px rgba(138, 92, 246, 0.25)",
              letterSpacing: "0.02em",
            }}
          >
            青春18LIGHT
          </h1>

          {/* 副標題 */}
          <p
            className="text-white/75 text-base sm:text-lg"
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            靜宜大學大眾傳播學系第十八屆畢業成果展
          </p>
        </div>

        {/* 底部漸層遮罩 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-[3]"
          style={{
            background: "linear-gradient(to top, #0d0620 0%, transparent 100%)",
          }}
        />
      </section>

      {/* ===== TAGLINE SECTION ===== */}
      <section
        id="tagline"
        className="py-24 px-4"
        style={{ background: "#f5f5f7" }}
      >
        <div
          ref={taglineSection.ref}
          className={`max-w-xl mx-auto text-center transition-all duration-1000 ${
            taglineSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              color: "#1a1a2e",
            }}
          >
            「燈光 set，青春 action」
          </h2>
          <div
            className="text-base sm:text-lg leading-loose"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#444",
            }}
          >
            <p>靈感源自影視拍攝現場熟悉的開場語。</p>
            <p>導演喊出這句話時鏡頭轉動、故事開場，</p>
            <p>我們第18屆的青春，不也正是如此？</p>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className="py-24 px-4"
        style={{ background: "#1a1a2e" }}
      >
        <div
          ref={aboutSection.ref}
          className={`max-w-xl mx-auto text-center transition-all duration-1000 ${
            aboutSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8"
            style={{
              fontFamily: "'Noto Serif TC', serif",
              textShadow: "0 0 20px rgba(138, 92, 246, 0.4)",
            }}
          >
            青春18LIGHT
          </h2>
          <p
            className="text-white/75 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            靈感源自 spotlight（聚光燈）的諧音，我們將青春與熱血投射到屬於自己的舞台。這不僅是一場成果展，更是一場獻給青春的告別。
          </p>
        </div>
      </section>

      {/* ===== FEATURES / THREE-COLUMN CARDS ===== */}
      <section
        id="features"
        className="px-0"
        style={{ background: "#1a1a2e" }}
      >
        <div
          ref={featuresSection.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            featuresSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* 左欄 - 深紫黑 */}
            <div
              className="p-8 md:p-10 flex flex-col justify-between min-h-[360px]"
              style={{ background: "#0f0828" }}
            >
              <div>
                <h3
                  className="text-lg sm:text-xl font-bold text-white mb-5"
                  style={{ fontFamily: "'Noto Serif TC', serif" }}
                >
                  我們始終相信：
                </h3>
                <p
                  className="text-white/70 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                >
                  在聚光燈下，接受光芒、閃耀發光。透過影像、文字、聲音，我們訴說屬於18屆的故事，展現四年來，對媒體世界的探索與成長。這一次，我們不只是站在幕後的創作者，而是親自走向聚光中心的主角。
                </p>
              </div>
              <div
                className="text-white/90 text-sm font-medium space-y-1"
                style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
              >
                <p>每個人都值得被看見。</p>
                <p>每個人都該站上舞台。</p>
              </div>
            </div>

            {/* 中欄 - 深藍漸層 + Logo */}
            <div
              className="flex items-center justify-center p-6 min-h-[300px]"
              style={{
                background: "linear-gradient(160deg, #0d1b4b 0%, #1a0a2e 60%, #0d0620 100%)",
              }}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/hero_logo_3d-bY5PwePTKcQKs32SLKfbe9.webp"
                alt="18LIGHT Logo"
                className="w-full max-w-[220px] md:max-w-[260px] object-contain"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(138, 92, 246, 0.45))",
                }}
              />
            </div>

            {/* 右欄 - 白色卡片 */}
            <div
              className="p-8 md:p-10 flex flex-col justify-center"
              style={{ background: "#f5f5f7" }}
            >
              <h3
                className="text-lg sm:text-xl font-bold mb-4"
                style={{
                  fontFamily: "'Noto Serif TC', serif",
                  color: "#1a1a2e",
                }}
              >
                造型設計靈感
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#555",
                }}
              >
                18LIGHT的外型，如同舞台上的 Spotlight聚光燈，讓光聚焦於每一位主角，照亮屬於你的精彩時刻。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VIDEO SECTION ===== */}
      <section
        id="video"
        className="py-16 px-4"
        style={{ background: "#0d0620" }}
      >
        <div
          ref={videoSection.ref}
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            videoSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="aspect-video overflow-hidden shadow-2xl"
            style={{
              borderRadius: "4px",
              boxShadow: "0 8px 60px rgba(138, 92, 246, 0.25)",
            }}
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/7BZilWnuP98"
              title="靜宜大學大眾傳播學系第十八屆畢業成果展《青春18LIGHT》宣傳片"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex items-center justify-between mt-4 px-1">
            <p
              className="text-white/50 text-xs"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              靜宜大學大眾傳播學系第十八屆畢業成果展《青春18LIGHT》宣傳片
            </p>
            <p
              className="text-white/50 text-xs"
              style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
            >
              觀看平台：
              <a
                href="https://www.youtube.com/watch?v=7BZilWnuP98"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white underline ml-1 transition-colors"
              >
                YouTube
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
