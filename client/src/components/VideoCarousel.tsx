/**
 * VideoCarousel Component
 * 水平滾動的宣傳片上傳區，支援2個影片，使用資料庫和檔案存儲
 */

import { useRef, useState, useEffect } from "react";
import { Upload, X, Play } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface VideoData {
  id: number;
  videoNumber: number;
  title: string;
  videoUrl?: string | null;
}

export default function VideoCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([null, null]);
  const [videoUrls, setVideoUrls] = useState<(string | null)[]>([null, null]);
  const [videoTitles, setVideoTitles] = useState<string[]>(["宣傳片 1", "宣傳片 2"]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // 獲取宣傳片列表
  const { data: videos = [] } = trpc.promotionalVideos.list.useQuery();
  
  // 更新宣傳片的 mutation
  const updateVideoMutation = trpc.promotionalVideos.update.useMutation();

  // 初始化數據
  useEffect(() => {
    if (videos && videos.length > 0) {
      const urls = videos.map(v => v.videoUrl || null);
      const titles = videos.map(v => v.title || `宣傳片 ${v.videoNumber}`);
      setVideoUrls(urls);
      setVideoTitles(titles);
    }
  }, [videos]);

  const handleVideoUpload = (index: number, file: File | null) => {
    const newFiles = [...videoFiles];
    newFiles[index] = file;
    setVideoFiles(newFiles);

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoUrl = event.target?.result as string;
        const newUrls = [...videoUrls];
        newUrls[index] = videoUrl;
        setVideoUrls(newUrls);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVideo = (index: number) => {
    const newFiles = [...videoFiles];
    newFiles[index] = null;
    setVideoFiles(newFiles);

    const newUrls = [...videoUrls];
    newUrls[index] = null;
    setVideoUrls(newUrls);
  };

  const handleSave = async (index: number) => {
    try {
      if (videos[index]) {
        await updateVideoMutation.mutateAsync({
          id: videos[index].id,
          title: videoTitles[index],
          videoUrl: videoUrls[index] || undefined,
        });
      }
      setEditingIndex(null);
    } catch (error) {
      console.error("Failed to save video:", error);
    }
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
          className="flex gap-6 overflow-x-auto scroll-smooth px-16"
          style={{ scrollBehavior: "smooth" }}
        >
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="flex-shrink-0 w-80 rounded-lg overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "2px solid #8b7355",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* 影片預覽 */}
              <div className="relative bg-gray-200 aspect-video flex items-center justify-center group">
                {videoUrls[index] ? (
                  <>
                    <video
                      src={videoUrls[index]!}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <button
                      onClick={() => handleRemoveVideo(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-gray-700 w-full h-full flex items-center justify-center">
                    <Upload size={32} />
                    <span className="text-sm">點擊上傳影片</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoUpload(index, e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 標題區域 */}
              <div className="p-4">
                {editingIndex === index ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={videoTitles[index]}
                      onChange={(e) => {
                        const newTitles = [...videoTitles];
                        newTitles[index] = e.target.value;
                        setVideoTitles(newTitles);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="宣傳片標題"
                      style={{ fontFamily: "'Noto Serif TC', serif" }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(index)}
                        disabled={updateVideoMutation.isPending}
                        className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h4
                      className="font-bold flex-1"
                      style={{
                        fontFamily: "'Noto Serif TC', serif",
                        color: "#5a4a3a",
                      }}
                    >
                      {videoTitles[index]}
                    </h4>
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      編輯
                    </button>
                  </div>
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
    </div>
  );
}
