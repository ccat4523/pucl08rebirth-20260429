/**
 * Navbar - 青春18LIGHT 導航欄
 * Design: 深宇宙舞台美學 - 毛玻璃效果頂部導航
 * Fixed position, transparent to glass transition on scroll
 */

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "主頁", href: "#home" },
  { label: "台中場", href: "#taichung" },
  { label: "高雄場", href: "#kaohsiung" },
  { label: "幹部介紹", href: "#staff" },
  { label: "指導老師", href: "#teachers" },
  {
    label: "各組作品介紹",
    href: "#works",
    children: [
      { label: "影像組", href: "#video" },
      { label: "廣播組", href: "#radio" },
      { label: "廣告組", href: "#advertising" },
      { label: "新聞組", href: "#news" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [worksOpen, setWorksOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWorksOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-glass shadow-lg shadow-purple-900/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setWorksOpen(!worksOpen)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-white/90 hover:text-white hover:text-glow transition-all duration-200 font-medium"
                    style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${worksOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {worksOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 rounded-lg overflow-hidden shadow-xl shadow-purple-900/40 border border-purple-500/20 bg-[#0d0620]/95 backdrop-blur-md">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-purple-600/20 transition-colors duration-150"
                          style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                          onClick={() => setWorksOpen(false)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm text-white/90 hover:text-white transition-all duration-200 font-medium hover:text-glow"
                  style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Logo - right side */}
          <div className="hidden md:flex items-center">
            <a href="#home" className="flex items-center gap-2">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/logo_icon-2gWXoqS2TiMANtJGEbiztC.png"
                alt="18LIGHT Logo"
                className="w-8 h-8 object-contain"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/logo_icon-2gWXoqS2TiMANtJGEbiztC.png"
                alt="18LIGHT Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="text-white text-sm font-medium" style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                青春18LIGHT
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0d0620]/98 backdrop-blur-md border-t border-purple-500/20">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  className="block px-3 py-2.5 text-sm text-white/90 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors"
                  style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-purple-600/20 rounded-lg transition-colors"
                        style={{ fontFamily: "'Noto Sans TC', sans-serif" }}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
