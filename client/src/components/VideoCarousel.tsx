/**
 * VideoCarousel Component
 * 水平滾動的影片上傳區，支援2個影片
 */

import { useRef, useState } from "react";
import { Upload, X, Play } from "lucide-react";

interface Video {
  id: number;
  url?: string;
  title: string;
}

export default function VideoCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>(
    Array.from({ length: 2 }, (_, i) => ({
      id: i + 1,
      title: `宣傳片 ${i + 1}`,
    }))
  );

  const handleVideoUpload = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const videoUrl = event.target?.result as string;
      setVideos(
        videos.map((v) =>
          v.id === id ? { ...v, url: videoUrl } : v
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVideo = (id: number) => {
    setVideos(
      videos.map((v) =>
        v.id === id ? { ...v, url: undefined } : v
      )
    );
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full py-12 px-4">
      <h3
        className="text-2xl font-bold text-center mb-8"
        style={{
          fontFamily: "'Noto Serif TC', serif",
          color: "#5a4a3a",
        }}
      >
        宣傳片
      </h3>

      <div className="relative">
        {/* 左箭頭 */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          style={{ background: "rgba(255, 255, 255, 0.9)" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 影片容器 */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "thin",
            scrollbarColor: "#8b7355 #f0ebe1",
          }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 w-96"
            >
              <div
                className="relative w-full h-64 rounded-sm overflow-hidden bg-gray-100 border-2 border-gray-300"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 235, 225, 0.9) 100%)",
                  border: "2px solid #8b7355",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                {video.url ? (
                  <>
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <button
                      onClick={() => handleRemoveVideo(video.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                      <Upload size={40} className="mx-auto mb-2 text-gray-400" />
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                      >
                        點擊上傳影片
                      </p>
                      <p
                        className="text-xs text-gray-500 mt-1"
                        style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                      >
                        {video.title}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleVideoUpload(video.id, file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 右箭頭 */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          style={{ background: "rgba(255, 255, 255, 0.9)" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style>{`
        div::-webkit-scrollbar {
          height: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f0ebe1;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: #8b7355;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #6b5d4f;
        }
      `}</style>
    </div>
  );
}
