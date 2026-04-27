/**
 * Footer - 青春18LIGHT 頁尾
 * Design: 深宇宙舞台美學 - 深色背景，白色文字
 * Contains: Logo, site name, address, contact, social links
 */

import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0520] border-t border-purple-500/20 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-start gap-4">
          {/* Logo + Site Name */}
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/logo_icon-2gWXoqS2TiMANtJGEbiztC.png"
              alt="18LIGHT Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <a
            href="#home"
            className="text-white/90 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
          >
            靜宜大學大眾傳播學系第十八屆畢業成果展《青春18LIGHT》
          </a>

          {/* Contact Info */}
          <div className="space-y-1.5 text-white/70 text-sm" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
            <p>地　址：43301 臺中市沙鹿區臺灣大道7段200號 任垣樓</p>
            <p>電　話：04-2632 8001　分機：17081～17084</p>
            <p>電子郵件：pumc18light@gmail.com</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} className="text-white" />
            </a>
            <a
              href="https://www.threads.net"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors border border-white/20"
              aria-label="Threads"
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.312-.883-2.371-.887h-.018c-.845 0-1.999.298-2.691 1.4l-1.787-1.216c.877-1.409 2.426-2.186 4.08-2.186h.023c3.307.016 5.208 2.087 5.255 5.699.068.019.137.037.204.059 1.327.423 2.386 1.195 3.064 2.236.979 1.487 1.123 3.552.38 5.537-1.044 2.748-3.532 4.317-7.005 4.342z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com"
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
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
          <p className="text-white/30 text-xs" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
            Designed with WordPress
          </p>
        </div>
      </div>
    </footer>
  );
}
