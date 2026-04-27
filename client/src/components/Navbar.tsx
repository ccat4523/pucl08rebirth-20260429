/**
 * Navbar Component - 蛻生畢展
 * Design: 古典文學 × 現代蛻變
 * Features: 毛玻璃效果、金色邊框、響應式導航
 */

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "主頁", href: "#home" },
  { label: "展覽資訊", href: "#info" },
  { label: "作品展示", href: "#works" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-glass shadow-md" : "bg-transparent"
      }`}
      style={{
        borderBottom: scrolled ? "1px solid rgba(212, 175, 55, 0.2)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663604108019/WWoiuccXVRycCjqYzzpk6j/rebirth_logo-c8LpyDDQYCvN6mnMZq8oV7.webp"
              alt="蛻生"
              className="w-9 h-9 object-contain"
            />
            <span
              className="text-base font-bold hidden sm:inline"
              style={{
                fontFamily: "'Noto Serif TC', serif",
                color: "#1a3a3a",
              }}
            >
              蛻生
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-accent font-medium"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#1a3a3a",
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "#1a3a3a" }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "rgba(245, 241, 232, 0.98)",
            borderTop: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-2 transition-colors hover:text-accent font-medium"
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  color: "#1a3a3a",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
