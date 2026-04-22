"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Smartphone,
  X,
  Plus,
  Lock,
  Shield,
  Download,
  Rocket,
  Eye,
  Moon,
  Sun,
  Palette,
  Package,
  FileCheck,
  Settings,
  LayoutGrid,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────── */

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface StorefrontConfig {
  merchantName: string;
  storeSlug: string;
  industry: string;
  primaryColor: string;
  products: Product[];
  layout: string;
  ctaStyle: string;
  showPrices: boolean;
  showReviews: boolean;
  darkMode: boolean;
  mobilePreview: boolean;
}

/* ────────────────────────────────────────────
   DEFAULT DATA
   ──────────────────────────────────────────── */

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "Enterprise API Access",
    price: "€299/mo",
    description: "Full access to our enterprise-grade API infrastructure with 99.99% uptime guarantee.",
  },
  {
    id: "p2",
    name: "Payment Gateway Integration",
    price: "€499/mo",
    description: "Multi-gateway payment processing with automatic failover and smart routing.",
  },
  {
    id: "p3",
    name: "CRM Analytics Suite",
    price: "€199/mo",
    description: "Advanced customer analytics with predictive modeling and churn detection.",
  },
];

/* ────────────────────────────────────────────
   ANIMATION VARIANTS
   ──────────────────────────────────────────── */

const panelSlideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const previewSlideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const topBarSlide = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const bottomBarSlide = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.05 * i, ease: "easeOut" },
  }),
};

/* ────────────────────────────────────────────
   COLLAPSIBLE SECTION
   ──────────────────────────────────────────── */

function CollapsibleSection({
  title,
  icon: Icon,
  index,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  index: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      variants={sectionVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      className="border border-[rgba(255,255,255,0.06)] rounded-md overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#0F0F0F] hover:bg-[#141414] transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-3.5 h-3.5 text-cyber-blue" />
          <span className="text-[10px] font-mono-data tracking-[0.2em] text-steel-silver/80 font-semibold">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-steel-silver/40" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.04)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   PRODUCT CARD IN CONFIG PANEL
   ──────────────────────────────────────────── */

function ProductConfigCard({
  product,
  onUpdate,
  onRemove,
}: {
  product: Product;
  onUpdate: (field: keyof Pick<Product, "name" | "price" | "description">, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="panel-light p-3 mb-2 group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[9px] font-mono-data text-matrix-green/60 tracking-widest">
          PRODUCT
        </span>
        <button
          onClick={onRemove}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-danger/20 text-steel-silver/30 hover:text-danger transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <Input
        value={product.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        placeholder="Product name"
        className="h-7 text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data mb-2"
      />
      <div className="flex gap-2 mb-2">
        <Input
          value={product.price}
          onChange={(e) => onUpdate("price", e.target.value)}
          placeholder="€0/mo"
          className="h-7 text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-matrix-green font-mono-data w-28"
        />
      </div>
      <Input
        value={product.description}
        onChange={(e) => onUpdate("description", e.target.value)}
        placeholder="Brief description..."
        className="h-7 text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver/60 font-mono-data"
      />
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   LIVE PREVIEW - DESKTOP
   ──────────────────────────────────────────── */

function DesktopPreview({ config }: { config: StorefrontConfig }) {
  const ctaRadius =
    config.ctaStyle === "Pill"
      ? "rounded-full"
      : config.ctaStyle === "Rounded"
        ? "rounded-lg"
        : "rounded-none";

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
      {/* Preview header bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#070707] border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27CA40]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-0.5 bg-[#111] rounded text-[9px] font-mono-data text-steel-silver/40 tracking-wider">
            {config.storeSlug || "my-store"}.atlas.store
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Preview content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Store header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-mono-data tracking-[0.2em] mb-3"
              style={{
                background: `${config.primaryColor}15`,
                color: config.primaryColor,
                border: `1px solid ${config.primaryColor}25`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.primaryColor }} />
              {config.industry || "E-Commerce"}
            </div>
            <h2
              className="text-xl font-mono-data font-bold tracking-wide mb-1"
              style={{ color: config.primaryColor }}
            >
              {config.merchantName || "My Store"}
            </h2>
            <p className="text-[10px] font-mono-data text-steel-silver/40 tracking-wider">
              {config.storeSlug || "my-store"}.atlas.store
            </p>
          </div>

          {/* Products */}
          {config.layout === "Grid" ? (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {config.products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 group hover:border-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div
                    className="w-full h-20 rounded mb-3 flex items-center justify-center"
                    style={{ background: `${config.primaryColor}08` }}
                  >
                    <Package className="w-6 h-6" style={{ color: `${config.primaryColor}40` }} />
                  </div>
                  <h3 className="text-xs font-mono-data font-semibold text-steel-silver mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-steel-silver/40 leading-relaxed mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  {config.showPrices && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono-data font-bold" style={{ color: config.primaryColor }}>
                        {product.price}
                      </span>
                      <button
                        className={`px-3 py-1 text-[9px] font-mono-data font-bold tracking-wider text-[#050505] ${ctaRadius} transition-opacity hover:opacity-90`}
                        style={{ background: config.primaryColor }}
                      >
                        GET
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : config.layout === "Hero" ? (
            <div className="mb-8 space-y-3">
              {/* Hero product */}
              {config.products.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-lg p-6"
                  style={{
                    background: `linear-gradient(135deg, ${config.primaryColor}15 0%, #111 100%)`,
                    border: `1px solid ${config.primaryColor}20`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono-data tracking-[0.2em] text-steel-silver/40 uppercase mb-2 block">
                        Featured
                      </span>
                      <h3 className="text-lg font-mono-data font-bold text-steel-silver mb-1">
                        {config.products[0].name}
                      </h3>
                      <p className="text-xs text-steel-silver/50 mb-4 max-w-xs">
                        {config.products[0].description}
                      </p>
                      <div className="flex items-center gap-3">
                        {config.showPrices && (
                          <span className="text-xl font-mono-data font-bold" style={{ color: config.primaryColor }}>
                            {config.products[0].price}
                          </span>
                        )}
                        <button
                          className={`px-5 py-2 text-[10px] font-mono-data font-bold tracking-wider text-[#050505] ${ctaRadius} transition-opacity hover:opacity-90`}
                          style={{ background: config.primaryColor }}
                        >
                          GET STARTED
                        </button>
                      </div>
                    </div>
                    <Package className="w-16 h-16 opacity-10" style={{ color: config.primaryColor }} />
                  </div>
                </motion.div>
              )}
              {/* Remaining products */}
              {config.products.slice(1).map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 flex items-center justify-between hover:border-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div>
                    <h3 className="text-xs font-mono-data font-semibold text-steel-silver mb-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-steel-silver/40">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {config.showPrices && (
                      <span className="text-sm font-mono-data font-bold" style={{ color: config.primaryColor }}>
                        {product.price}
                      </span>
                    )}
                    <button
                      className={`px-3 py-1 text-[9px] font-mono-data font-bold tracking-wider text-[#050505] ${ctaRadius} transition-opacity hover:opacity-90`}
                      style={{ background: config.primaryColor }}
                    >
                      GET
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Single Column */
            <div className="space-y-3 mb-8">
              {config.products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 flex items-center justify-between hover:border-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${config.primaryColor}10` }}
                    >
                      <Package className="w-5 h-5" style={{ color: `${config.primaryColor}50` }} />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono-data font-semibold text-steel-silver">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-steel-silver/40">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {config.showPrices && (
                      <span className="text-sm font-mono-data font-bold" style={{ color: config.primaryColor }}>
                        {product.price}
                      </span>
                    )}
                    <button
                      className={`px-3 py-1.5 text-[9px] font-mono-data font-bold tracking-wider text-[#050505] ${ctaRadius} transition-opacity hover:opacity-90`}
                      style={{ background: config.primaryColor }}
                    >
                      GET
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Compliance footer - always visible */}
          <div
            className="border rounded-lg p-3"
            style={{
              borderColor: `${config.primaryColor}30`,
              background: `${config.primaryColor}06`,
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Lock className="w-3 h-3" style={{ color: config.primaryColor }} />
              <span
                className="text-[8px] font-mono-data tracking-[0.2em] font-bold"
                style={{ color: config.primaryColor }}
              >
                COMPLIANCE
              </span>
            </div>
            <p className="text-[9px] font-mono-data text-steel-silver/50 leading-relaxed">
              Powered by Atlas Global Core. Transactions processed by{" "}
              <span className="text-steel-silver/70">{config.merchantName || "Merchant"}</span>. Atlas
              operates solely as a Technical Service Provider.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

/* ────────────────────────────────────────────
   LIVE PREVIEW - MOBILE (Phone Frame)
   ──────────────────────────────────────────── */

function MobilePreview({ config }: { config: StorefrontConfig }) {
  const ctaRadius =
    config.ctaStyle === "Pill"
      ? "rounded-full"
      : config.ctaStyle === "Rounded"
        ? "rounded-lg"
        : "rounded-none";

  return (
    <div className="flex items-center justify-center py-4">
      {/* Phone bezel */}
      <div className="relative w-[280px] h-[560px] bg-[#1a1a1a] rounded-[2.5rem] p-[6px] shadow-2xl">
        {/* Phone screen border */}
        <div className="w-full h-full bg-[#0A0A0A] rounded-[2.2rem] overflow-hidden border border-[rgba(255,255,255,0.08)] relative">
          {/* Dynamic island / notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a1a] rounded-full z-10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#222]" />
          </div>

          {/* Screen content */}
          <ScrollArea className="h-full">
            <div className="pt-10 pb-4 px-4">
              {/* Store header */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[7px] font-mono-data tracking-[0.15em] mb-2"
                  style={{
                    background: `${config.primaryColor}15`,
                    color: config.primaryColor,
                    border: `1px solid ${config.primaryColor}20`,
                  }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: config.primaryColor }} />
                  {config.industry || "E-Commerce"}
                </div>
                <h2
                  className="text-sm font-mono-data font-bold tracking-wide"
                  style={{ color: config.primaryColor }}
                >
                  {config.merchantName || "My Store"}
                </h2>
              </div>

              {/* Products */}
              <div className="space-y-2.5 mb-6">
                {config.products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${config.primaryColor}10` }}
                      >
                        <Package className="w-4 h-4" style={{ color: `${config.primaryColor}50` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[10px] font-mono-data font-semibold text-steel-silver truncate">
                          {product.name}
                        </h3>
                        <p className="text-[8px] text-steel-silver/40 truncate">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    {config.showPrices && (
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                        <span className="text-xs font-mono-data font-bold" style={{ color: config.primaryColor }}>
                          {product.price}
                        </span>
                        <button
                          className={`px-3 py-1 text-[8px] font-mono-data font-bold tracking-wider text-[#050505] ${ctaRadius}`}
                          style={{ background: config.primaryColor }}
                        >
                          GET
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Compliance footer */}
              <div
                className="rounded-lg p-2.5"
                style={{
                  borderColor: `${config.primaryColor}25`,
                  background: `${config.primaryColor}06`,
                  border: `1px solid ${config.primaryColor}25`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock className="w-2.5 h-2.5" style={{ color: config.primaryColor }} />
                  <span
                    className="text-[6px] font-mono-data tracking-[0.15em] font-bold"
                    style={{ color: config.primaryColor }}
                  >
                    COMPLIANCE
                  </span>
                </div>
                <p className="text-[7px] font-mono-data text-steel-silver/40 leading-relaxed">
                  Powered by Atlas Global Core. Transactions processed by{" "}
                  <span className="text-steel-silver/60">{config.merchantName || "Merchant"}</span>. Atlas
                  operates solely as a Technical Service Provider.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[rgba(255,255,255,0.15)] rounded-full" />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN STUDIO BUILDER
   ──────────────────────────────────────────── */

export function StudioBuilder() {
  const [config, setConfig] = useState<StorefrontConfig>({
    merchantName: "",
    storeSlug: "",
    industry: "E-Commerce",
    primaryColor: "#00FF41",
    products: [...defaultProducts],
    layout: "Single Column",
    ctaStyle: "Pill",
    showPrices: true,
    showReviews: false,
    darkMode: true,
    mobilePreview: false,
  });

  const [savedAt, setSavedAt] = useState<string>("just now");

  /* ─────────── Config updaters ─────────── */

  const updateConfig = useCallback(
    <K extends keyof StorefrontConfig>(key: K, value: StorefrontConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
      setSavedAt("just now");
    },
    []
  );

  const updateProduct = useCallback(
    (productId: string, field: keyof Pick<Product, "name" | "price" | "description">, value: string) => {
      setConfig((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === productId ? { ...p, [field]: value } : p
        ),
      }));
      setSavedAt("just now");
    },
    []
  );

  const addProduct = useCallback(() => {
    const newId = `p${Date.now()}`;
    setConfig((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: newId,
          name: "New Product",
          price: "€0/mo",
          description: "Product description goes here.",
        },
      ],
    }));
    setSavedAt("just now");
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setConfig((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
    setSavedAt("just now");
  }, []);

  /* ─────────── Render ─────────── */

  return (
    <div className="h-screen flex flex-col bg-obsidian overflow-hidden">
      {/* ═══════ TOP BAR ═══════ */}
      <motion.header
        variants={topBarSlide}
        initial="hidden"
        animate="visible"
        className="h-12 flex items-center justify-between px-4 md:px-6 bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.06)] shrink-0 z-20"
      >
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-matrix-green" />
            <span className="text-[10px] md:text-xs font-mono-data tracking-[0.15em] text-matrix-green glow-green font-bold">
              ATLAS STUDIO
            </span>
          </div>
          <span className="text-[10px] md:text-xs font-mono-data tracking-[0.1em] text-steel-silver/60">
            {"// STOREFRONT BUILDER"}
          </span>
        </div>

        {/* Center: Toggles */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            {config.darkMode ? (
              <Moon className="w-3 h-3 text-matrix-green/60" />
            ) : (
              <Sun className="w-3 h-3 text-warning" />
            )}
            <span className="text-[9px] md:text-[10px] font-mono-data text-steel-silver/50 tracking-wider hidden sm:inline">
              DARK
            </span>
            <Switch
              checked={config.darkMode}
              onCheckedChange={(v) => updateConfig("darkMode", v)}
              className="scale-75"
            />
          </div>
          <Separator orientation="vertical" className="h-5 bg-[rgba(255,255,255,0.06)]" />
          <div className="flex items-center gap-2">
            <Smartphone className="w-3 h-3 text-cyber-blue/60" />
            <span className="text-[9px] md:text-[10px] font-mono-data text-steel-silver/50 tracking-wider hidden sm:inline">
              MOBILE
            </span>
            <Switch
              checked={config.mobilePreview}
              onCheckedChange={(v) => updateConfig("mobilePreview", v)}
              className="scale-75"
            />
          </div>
        </div>

        {/* Right: Publish */}
        <Button
          onClick={() => setSavedAt("just now")}
          className="h-7 px-4 bg-matrix-green hover:bg-matrix-green/90 text-obsidian text-[10px] font-mono-data font-bold tracking-[0.15em] rounded transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]"
        >
          PUBLISH
        </Button>
      </motion.header>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── LEFT PANEL ─── */}
        <motion.aside
          variants={panelSlideIn}
          initial="hidden"
          animate="visible"
          className="w-full md:w-80 shrink-0 border-r border-[rgba(255,255,255,0.06)] bg-[#080808] flex flex-col overflow-hidden"
        >
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.04)] shrink-0">
            <span className="text-[10px] font-mono-data tracking-[0.2em] text-cyber-blue glow-blue font-bold">
              STOREFRONT CONFIGURATION
            </span>
          </div>

          {/* Scrollable config sections */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2.5">
              {/* 1. Merchant Identity */}
              <CollapsibleSection title="MERCHANT IDENTITY" icon={ShoppingCart} index={0}>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.15em]">
                      MERCHANT NAME
                    </Label>
                    <Input
                      value={config.merchantName}
                      onChange={(e) => updateConfig("merchantName", e.target.value)}
                      placeholder="Enter merchant name"
                      className="h-8 text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.15em]">
                      STORE SLUG
                    </Label>
                    <Input
                      value={config.storeSlug}
                      onChange={(e) =>
                        updateConfig(
                          "storeSlug",
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                        )
                      }
                      placeholder="my-store"
                      className="h-8 text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.15em]">
                      INDUSTRY
                    </Label>
                    <Select
                      value={config.industry}
                      onValueChange={(v) => updateConfig("industry", v)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-[rgba(255,255,255,0.08)]">
                        <SelectItem value="E-Commerce" className="text-xs font-mono-data">E-Commerce</SelectItem>
                        <SelectItem value="SaaS" className="text-xs font-mono-data">SaaS</SelectItem>
                        <SelectItem value="Digital Goods" className="text-xs font-mono-data">Digital Goods</SelectItem>
                        <SelectItem value="Services" className="text-xs font-mono-data">Services</SelectItem>
                        <SelectItem value="Crypto" className="text-xs font-mono-data">Crypto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.15em]">
                      PRIMARY COLOR
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig("primaryColor", e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-[rgba(255,255,255,0.1)] bg-transparent"
                        />
                      </div>
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => updateConfig("primaryColor", e.target.value)}
                        className="h-8 text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* 2. Product Catalog */}
              <CollapsibleSection title="PRODUCT CATALOG" icon={Package} index={1}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono-data text-steel-silver/40 tracking-wider">
                      {config.products.length} ITEMS
                    </span>
                  </div>
                  <ScrollArea className="max-h-64">
                    <AnimatePresence mode="popLayout">
                      {config.products.map((product) => (
                        <ProductConfigCard
                          key={product.id}
                          product={product}
                          onUpdate={(field, value) => updateProduct(product.id, field, value)}
                          onRemove={() => removeProduct(product.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </ScrollArea>
                  <Button
                    onClick={addProduct}
                    variant="ghost"
                    className="w-full h-7 text-[9px] font-mono-data tracking-[0.15em] text-matrix-green/70 hover:text-matrix-green hover:bg-matrix-green/5 border border-dashed border-matrix-green/20 hover:border-matrix-green/40 rounded"
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    ADD PRODUCT
                  </Button>
                </div>
              </CollapsibleSection>

              {/* 3. Compliance Section */}
              <CollapsibleSection title="COMPLIANCE (AUTO)" icon={Shield} index={2} defaultOpen={true}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-matrix-green/10 border border-matrix-green/20">
                      <Lock className="w-3 h-3 text-matrix-green" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[8px] font-mono-data tracking-[0.15em] bg-matrix-green/5 border-matrix-green/30 text-matrix-green/80 px-2 py-0"
                    >
                      TSP ENFORCED
                    </Badge>
                  </div>

                  <div
                    className="border rounded-md p-3 bg-matrix-green/[0.03]"
                    style={{ borderColor: "rgba(0,255,65,0.2)" }}
                  >
                    <p className="text-[9px] font-mono-data text-steel-silver/60 leading-relaxed">
                      <span className="text-matrix-green/70 font-bold">INFO:</span> The following
                      compliance footer is{" "}
                      <span className="text-matrix-green">automatically injected</span> into all
                      generated storefronts per TSP regulatory requirements.
                    </p>
                    <div className="mt-2 p-2 bg-[#050505] rounded border border-[rgba(255,255,255,0.04)]">
                      <p className="text-[8px] font-mono-data text-steel-silver/50 leading-relaxed italic">
                        &quot;Powered by Atlas Global Core. Transactions processed by{" "}
                        <span className="text-steel-silver/70 not-italic">
                          {config.merchantName || "[Merchant Name]"}
                        </span>
                        . Atlas operates solely as a Technical Service Provider.&quot;
                      </p>
                    </div>
                  </div>

                  <p className="text-[8px] font-mono-data text-steel-silver/30 leading-relaxed">
                    This compliance footer is automatically injected into all generated storefronts
                    per TSP regulatory requirements. It cannot be modified or removed.
                  </p>
                </div>
              </CollapsibleSection>

              {/* 4. Theme Settings */}
              <CollapsibleSection title="THEME SETTINGS" icon={Settings} index={3}>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.15em]">
                      LAYOUT
                    </Label>
                    <Select
                      value={config.layout}
                      onValueChange={(v) => updateConfig("layout", v)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-[rgba(255,255,255,0.08)]">
                        <SelectItem value="Single Column" className="text-xs font-mono-data">
                          Single Column
                        </SelectItem>
                        <SelectItem value="Grid" className="text-xs font-mono-data">
                          Grid
                        </SelectItem>
                        <SelectItem value="Hero" className="text-xs font-mono-data">
                          Hero
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.15em]">
                      CTA STYLE
                    </Label>
                    <Select
                      value={config.ctaStyle}
                      onValueChange={(v) => updateConfig("ctaStyle", v)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs bg-[#111] border-[rgba(255,255,255,0.06)] text-steel-silver font-mono-data">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-[rgba(255,255,255,0.08)]">
                        <SelectItem value="Pill" className="text-xs font-mono-data">
                          Pill
                        </SelectItem>
                        <SelectItem value="Rounded" className="text-xs font-mono-data">
                          Rounded
                        </SelectItem>
                        <SelectItem value="Sharp" className="text-xs font-mono-data">
                          Sharp
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-[rgba(255,255,255,0.04)]" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3 text-steel-silver/40" />
                      <span className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.1em]">
                        SHOW PRICES
                      </span>
                    </div>
                    <Switch
                      checked={config.showPrices}
                      onCheckedChange={(v) => updateConfig("showPrices", v)}
                      className="scale-75"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-3 h-3 text-steel-silver/40" />
                      <span className="text-[9px] font-mono-data text-steel-silver/50 tracking-[0.1em]">
                        SHOW REVIEWS
                      </span>
                    </div>
                    <Switch
                      checked={config.showReviews}
                      onCheckedChange={(v) => updateConfig("showReviews", v)}
                      className="scale-75"
                    />
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </ScrollArea>
        </motion.aside>

        {/* ─── RIGHT PANEL (Preview) ─── */}
        <motion.main
          variants={previewSlideIn}
          initial="hidden"
          animate="visible"
          className="flex-1 bg-obsidian flex flex-col overflow-hidden"
        >
          {/* Preview toolbar */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.04)] bg-[#070707] shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono-data text-steel-silver/30 tracking-[0.2em] uppercase">
                Live Preview
              </span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix-green opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-matrix-green" />
              </span>
            </div>

            {/* Desktop/Mobile toggle */}
            <div className="flex items-center bg-[#111] rounded-md p-0.5 border border-[rgba(255,255,255,0.06)]">
              <button
                onClick={() => updateConfig("mobilePreview", false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono-data tracking-wider transition-all ${
                  !config.mobilePreview
                    ? "bg-[#1A1A1A] text-matrix-green shadow-sm"
                    : "text-steel-silver/40 hover:text-steel-silver/60"
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden sm:inline">DESKTOP</span>
              </button>
              <button
                onClick={() => updateConfig("mobilePreview", true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-mono-data tracking-wider transition-all ${
                  config.mobilePreview
                    ? "bg-[#1A1A1A] text-cyber-blue shadow-sm"
                    : "text-steel-silver/40 hover:text-steel-silver/60"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span className="hidden sm:inline">MOBILE</span>
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 p-4 md:p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={config.mobilePreview ? "mobile" : "desktop"}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                {config.mobilePreview ? (
                  <MobilePreview config={config} />
                ) : (
                  <DesktopPreview config={config} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>

      {/* ═══════ BOTTOM BAR ═══════ */}
      <motion.footer
        variants={bottomBarSlide}
        initial="hidden"
        animate="visible"
        className="h-11 flex items-center justify-between px-4 md:px-6 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.06)] shrink-0 z-20"
      >
        {/* Left: Status */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-[8px] font-mono-data tracking-[0.2em] bg-warning/5 border-warning/30 text-warning/80 px-2 py-0"
          >
            DRAFT
          </Badge>
          <span className="text-[9px] font-mono-data text-steel-silver/30 tracking-wider hidden sm:inline">
            Last saved: {savedAt}
          </span>
        </div>

        {/* Center: Compliance tag */}
        <div className="hidden md:flex items-center gap-2">
          <Lock className="w-3 h-3 text-matrix-green/40" />
          <span className="terminal-text">
            COMPLIANCE::AUTO-INJECTED | PCI-DSS::ENFORCED
          </span>
        </div>

        {/* Right: Export buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-7 px-3 text-[9px] font-mono-data tracking-[0.12em] text-steel-silver/60 hover:text-steel-silver hover:bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded"
          >
            <Download className="w-3 h-3 mr-1.5" />
            EXPORT HTML
          </Button>
          <Button
            variant="ghost"
            className="h-7 px-3 text-[9px] font-mono-data tracking-[0.12em] text-cyber-blue/70 hover:text-cyber-blue hover:bg-cyber-blue/5 border border-cyber-blue/20 hover:border-cyber-blue/40 rounded"
          >
            <Rocket className="w-3 h-3 mr-1.5" />
            DEPLOY
          </Button>
        </div>
      </motion.footer>
    </div>
  );
}
