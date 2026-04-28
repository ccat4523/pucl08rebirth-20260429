/**
 * ShareButtons Component
 * 支持 LINE、複製連結分享
 */

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export default function ShareButtons({
  title,
  description,
  imageUrl,
  url,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // 確保 URL 中只有一個 v=2 參數
  const getShareUrl = () => {
    // 移除已存在的 v=2 參數
    let cleanUrl = url.replace(/[?&]v=2/g, '');
    // 添加 v=2 參數
    return cleanUrl.includes('?') ? `${cleanUrl}&v=2` : `${cleanUrl}?v=2`;
  };

  const handleCopyLink = () => {
    const shareUrl = getShareUrl();
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLineShare = () => {
    const shareUrl = getShareUrl();
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(title + " " + shareUrl)}`;
    window.open(lineUrl, "_blank");
  };

  return (
    <div className="flex gap-4 items-center justify-center flex-wrap">
      {/* LINE 分享 */}
      <button
        onClick={handleLineShare}
        className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all hover:opacity-80"
        style={{
          background: "#00b900",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Noto Sans TC', sans-serif",
          fontSize: "0.9rem",
          fontWeight: "600",
        }}
        title="分享到 LINE"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.365 9.863c.349-1.926.166-3.26-.424-4.216-.589-.956-1.646-1.708-3.269-2.256-1.623-.548-3.732-.821-6.391-.821-2.66 0-4.768.273-6.391.821-1.623.548-2.68 1.3-3.269 2.256C.108 6.603-.075 7.937.274 9.863c.349 1.926 1.245 3.657 2.686 5.193 1.441 1.536 3.428 2.769 5.96 3.699.254.092.473.212.656.358.183.146.315.325.396.536l.721 2.237c.092.285.191.504.296.656.105.152.291.228.558.228.267 0 .453-.076.558-.228.105-.152.204-.371.296-.656l.721-2.237c.081-.211.213-.39.396-.536.183-.146.402-.266.656-.358 2.532-.93 4.519-2.163 5.96-3.699 1.441-1.536 2.337-3.267 2.686-5.193zm-9.365 3.507c-.849 0-1.535-.302-2.056-.905-.521-.603-.782-1.326-.782-2.169 0-.843.261-1.566.782-2.169.521-.603 1.207-.905 2.056-.905.849 0 1.535.302 2.056.905.521.603.782 1.326.782 2.169 0 .843-.261 1.566-.782 2.169-.521.603-1.207.905-2.056.905zm4.512 0c-.849 0-1.535-.302-2.056-.905-.521-.603-.782-1.326-.782-2.169 0-.843.261-1.566.782-2.169.521-.603 1.207-.905 2.056-.905.849 0 1.535.302 2.056.905.521.603.782 1.326.782 2.169 0 .843-.261 1.566-.782 2.169-.521.603-1.207.905-2.056.905z" />
        </svg>
        LINE
      </button>

      {/* 複製連結 */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all hover:opacity-80"
        style={{
          background: copied ? "#4caf50" : "#8b7355",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Noto Sans TC', sans-serif",
          fontSize: "0.9rem",
          fontWeight: "600",
        }}
        title="複製連結"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        {copied ? "已複製" : "複製連結"}
      </button>
    </div>
  );
}
