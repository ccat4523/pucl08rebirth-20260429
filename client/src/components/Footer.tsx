/**
 * Footer Component - 蛻生畢展
 * Design: 古典文學 × 現代蛻變
 * Contains: Logo, site name, exhibition info, contact, social links
 */

import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t py-12"
      style={{
        background: "#f5f1e8",
        borderTop: "2px solid #d4af37",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-start gap-6">
          {/* Logo + Site Name */}
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/rebirth_logo-c8LpyDDQYCvN6mnMZq8oV7.webp"
              alt="蛻生"
              className="w-12 h-12 object-contain"
            />
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "#1a3a3a",
              }}
            >
              蛻生
            </span>
          </div>

          <a
            href="#home"
            className="text-sm transition-colors hover:text-accent"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#1a3a3a",
            }}
          >
            靜宜大學中國文學系第八屆畢業成果展
          </a>

          {/* Exhibition Info */}
          <div
            className="space-y-1.5 text-sm"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#555",
            }}
          >
            <p>
              <span style={{ color: "#d4af37", fontWeight: "bold" }}>▹展覽日期</span>
              　2026年5月12日（二）– 5月14日（四）
            </p>
            <p>
              <span style={{ color: "#d4af37", fontWeight: "bold" }}>🕙 開放時間</span>
              　09:00 – 16:00
            </p>
            <p>
              <span style={{ color: "#d4af37", fontWeight: "bold" }}>📍 展覽地點</span>
              　靜宜大學宜園餐廳樓上iDO培力基地
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61587027196885"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: "#1a3a3a" }}
              aria-label="Facebook"
            >
              <Facebook size={18} className="text-white" />
            </a>
            <a
              href="https://www.instagram.com/pucl08rebirth/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-white" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 border-t flex justify-end"
          style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}
        >
          <p
            className="text-xs"
            style={{
              fontFamily: "'Noto Sans TC', sans-serif",
              color: "#999",
            }}
          >
            蛻生 - 靜宜大學中國文學系第八屆畢業成果展
          </p>
        </div>
      </div>
    </footer>
  );
}
