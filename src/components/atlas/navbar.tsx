"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Layout, Scale, Shield, Circle, User, Globe, CreditCard, Cpu } from "lucide-react";
import { useAtlasStore } from "@/lib/store";
import type { Page, Locale } from "@/lib/store";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  "pt-PT": "PT-PT",
  "pt-BR": "BR",
};

const localeOptions: Locale[] = ["en", "fr", "pt-PT", "pt-BR"];

const navItems: { label: string; icon: React.ElementType; page: Page }[] = [
  { label: "ATLASWALLET", icon: Terminal, page: "wallet" },
  { label: "STUDIO", icon: Layout, page: "studio" },
  { label: "PRICING", icon: CreditCard, page: "prices" },
  { label: "SERVICES", icon: Cpu, page: "services" },
  { label: "LEGAL", icon: Scale, page: "legal" },
];

export function Navbar() {
  const { currentPage, setPage, kybCompleted, locale, setLocale } = useAtlasStore();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNav = (page: Page) => {
    if ((page === "command" || page === "studio" || page === "wallet") && !kybCompleted) {
      setPage("command");
    } else {
      setPage(page);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-4 md:px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#00FF41] rounded-sm flex items-center justify-center">
          <Shield className="w-4 h-4 text-[#050505]" />
        </div>
        <span className="font-mono-data text-[11px] md:text-xs tracking-[0.2em] text-[#00FF41] glow-green font-bold hidden sm:block">
          ATLAS GLOBAL CORE
        </span>
      </div>

      {/* Center: Navigation */}
      <div className="flex items-center gap-1 md:gap-2">
        {navItems.map(({ label, icon: Icon, page }) => {
          const isActive = currentPage === page;
          return (
            <motion.button
              key={page}
              onClick={() => handleNav(page)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[10px] md:text-xs font-mono-data tracking-wider transition-colors ${
                isActive
                  ? "text-[#00FF41]"
                  : "text-[#C0C0C0] hover:text-[#00F0FF]"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#00FF41]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Right: Status */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono-data text-[#C0C0C0]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span>
          </span>
          SYSTEM ONLINE
        </div>

        {/* Language Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono-data tracking-wider text-[#C0C0C0] hover:text-[#00F0FF] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{localeLabels[locale]}</span>
          </button>

          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded shadow-lg overflow-hidden min-w-[80px]"
            >
              {localeOptions.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[10px] font-mono-data tracking-wider transition-colors ${
                    locale === loc
                      ? "text-[#00FF41] bg-[rgba(0,255,65,0.06)]"
                      : "text-[#C0C0C0] hover:text-[#00F0FF] hover:bg-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  {localeLabels[loc]}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-[#C0C0C0]" />
        </div>
      </div>
    </nav>
  );
}
