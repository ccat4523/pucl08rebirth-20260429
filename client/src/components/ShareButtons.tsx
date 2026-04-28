/**
 * ShareButtons Component
 * 支持 Facebook、Instagram、複製連結分享
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

  const handleFacebookShare = () => {
    const shareUrl = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleInstagramShare = () => {
    // Instagram 不支持直接分享連結，只能提示用戶手動分享
    const shareUrl = getShareUrl();
    alert("請在 Instagram 上手動分享此連結：\n" + shareUrl);
  };

  const handleLineShare = () => {
    const shareUrl = getShareUrl();
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(title + " " + shareUrl)}`;
    window.open(lineUrl, "_blank");
  };

  return (
    <div className="flex gap-4 items-center justify-center flex-wrap">
      {/* Facebook 分享 */}
      <button
        onClick={handleFacebookShare}
        className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all hover:opacity-80"
        style={{
          background: "#1877f2",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Noto Sans TC', sans-serif",
          fontSize: "0.9rem",
          fontWeight: "600",
        }}
        title="分享到 Facebook"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Facebook
      </button>

      {/* Instagram 分享 */}
      <button
        onClick={handleInstagramShare}
        className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all hover:opacity-80"
        style={{
          background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Noto Sans TC', sans-serif",
          fontSize: "0.9rem",
          fontWeight: "600",
        }}
        title="分享到 Instagram"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
        </svg>
        Instagram
      </button>

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
