"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Route, Brain, LayoutGrid, Activity, Zap, Globe, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { useAtlasStore } from "@/lib/store";

/* ────────────────────────────────────────────
   ANIMATION VARIANTS
   ──────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ────────────────────────────────────────────
   FLOATING PARTICLE COMPONENT
   ──────────────────────────────────────────── */

function FloatingParticles() {
  // Use deterministic values from index to avoid hydration mismatch
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (i * 37 + 13) % 100,
      y: (i * 53 + 7) % 100,
      size: (i % 3) * 0.7 + 1,
      duration: (i % 8) + 6,
      delay: (i % 5),
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-matrix-green/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   GRID LINE DECORATION
   ──────────────────────────────────────────── */

function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,255,65,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Top-right glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 60%)",
        }}
      />
      {/* Bottom-left glow */}
      <div
        className="absolute bottom-0 left-0 w-80 h-80"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,65,0.03) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   LIVE TRANSACTION PULSE
   ──────────────────────────────────────────── */

function LivePulse() {
  const [count, setCount] = useState("12,847");

  useEffect(() => {
    const interval = setInterval(() => {
      const base = 12800 + Math.floor(Math.random() * 150);
      setCount(base.toLocaleString());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      className="absolute bottom-8 right-8 hidden md:flex items-center gap-3 panel px-4 py-2.5"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix-green opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-matrix-green" />
      </span>
      <div className="flex flex-col">
        <span className="text-[9px] font-mono-data text-steel-silver/50 tracking-widest uppercase">
          Live Throughput
        </span>
        <span className="text-sm font-mono-data text-matrix-green glow-green font-bold tracking-wide">
          {count} tx/sec
        </span>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   1. HERO SECTION
   ──────────────────────────────────────────── */

function HeroSection() {
  const { setPage } = useAtlasStore();
  const [displayText, setDisplayText] = useState("");
  const fullText = "THE ULTIMATE COMMERCE OPERATING SYSTEM";
  const [showCursor, setShowCursor] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // Typing effect
  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 35);
    return () => clearInterval(typeInterval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-14 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg" />
      <GridOverlay />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
        {/* Pre-headline tag */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,255,65,0.15)] bg-[rgba(0,255,65,0.04)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-matrix-green" />
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-data tracking-[0.2em] text-matrix-green/80 uppercase">
              Infrastructure v2.0 — Now Live
            </span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="font-mono-data text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide leading-tight text-matrix-green glow-green mb-6"
        >
          {displayText}
          <motion.span
            animate={{ opacity: showCursor ? 1 : 0 }}
            transition={{ duration: 0.1 }}
            className="inline-block w-[3px] h-[0.85em] bg-matrix-green ml-1 align-middle"
            style={{ boxShadow: "0 0 8px rgba(0,255,65,0.6)" }}
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="text-sm md:text-base lg:text-lg text-steel-silver/70 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          High-availability B2B infrastructure. CRM, SaaS Marketplaces, and
          Payment Orchestration fused into an indestructible core.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.95}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => setPage("command")}
            className="group relative px-8 py-3 bg-matrix-green text-obsidian font-mono-data text-xs md:text-sm font-bold tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.3)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center gap-2">
              REQUEST ACCESS
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>

          <motion.button
            onClick={() => setPage("command")}
            className="group relative px-8 py-3 border border-cyber-blue/50 text-cyber-blue font-mono-data text-xs md:text-sm font-bold tracking-widest rounded transition-all duration-300 hover:bg-cyber-blue/5 hover:border-cyber-blue hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center gap-2">
              DEPLOY INFRASTRUCTURE
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </motion.div>

        {/* Terminal decoration below CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.2}
          className="mt-12 flex items-center justify-center gap-4 text-steel-silver/20 font-mono-data text-[10px] tracking-widest"
        >
          <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-steel-silver/20" />
          <span>POWERED BY NEXFLOWX</span>
          <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-steel-silver/20" />
        </motion.div>
      </div>

      {/* Live pulse */}
      <LivePulse />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian to-transparent pointer-events-none" />
    </section>
  );
}

/* ────────────────────────────────────────────
   2. FEATURE GRID SECTION
   ──────────────────────────────────────────── */

const features = [
  {
    icon: Route,
    title: "NeXFlowX Routing Engine",
    description:
      "Intelligent transaction routing across multiple payment gateways. Automatic failover, load balancing, and real-time latency optimization. Supports Stripe, Adyen, Viva Wallet, and cryptocurrency processors.",
    tag: "PAYMENTS",
  },
  {
    icon: Brain,
    title: "The Brain CRM",
    description:
      "Merchant intelligence platform with predictive analytics. Customer segmentation, churn detection, LTV forecasting, and automated engagement workflows powered by behavioral data pipelines.",
    tag: "INTELLIGENCE",
  },
  {
    icon: LayoutGrid,
    title: "Atlas Studio",
    description:
      "Mobile-first storefront builder with automated compliance injection. Generate optimized product pages with built-in PCI-DSS footer disclaimers, A/B testing frameworks, and conversion rate optimization.",
    tag: "COMMERCE",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      custom={index * 0.15}
      variants={scaleIn}
      initial="hidden"
      animate={controls}
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative panel p-6 md:p-8 cursor-default transition-all duration-300 hover:glow-border-green"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-matrix-green/0 to-transparent group-hover:via-matrix-green/30 transition-all duration-500" />

      {/* Tag */}
      <span className="inline-block text-[9px] font-mono-data tracking-[0.25em] text-cyber-blue/60 uppercase mb-4">
        {feature.tag}
      </span>

      {/* Icon */}
      <div className="w-10 h-10 rounded flex items-center justify-center bg-matrix-green/10 border border-matrix-green/20 mb-5 group-hover:bg-matrix-green/15 group-hover:border-matrix-green/30 transition-all duration-300">
        <feature.icon className="w-5 h-5 text-matrix-green" />
      </div>

      {/* Title */}
      <h3 className="font-mono-data text-sm md:text-base font-bold text-steel-silver tracking-wide mb-3 group-hover:text-matrix-green transition-colors duration-300">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-xs md:text-sm text-steel-silver/50 leading-relaxed">
        {feature.description}
      </p>

      {/* Corner decoration */}
      <div className="absolute bottom-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-0 right-0 w-4 h-px bg-matrix-green/40" />
        <div className="absolute bottom-0 right-0 h-4 w-px bg-matrix-green/40" />
      </div>
    </motion.div>
  );
}

function FeatureGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <span className="inline-block text-[10px] md:text-[11px] font-mono-data tracking-[0.3em] text-steel-silver/30 uppercase mb-3">
            {"// Infrastructure"}
          </span>
          <h2 className="font-mono-data text-xl md:text-2xl lg:text-3xl font-bold text-cyber-blue glow-blue tracking-wide">
            CORE MODULES
          </h2>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   3. TRUST BAR
   ──────────────────────────────────────────── */

const partners = [
  "STRIPE",
  "ADYEN",
  "TON",
  "DOCKER",
  "PCI-DSS",
  "ISO 27001",
];

function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative py-16 md:py-20 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h3 className="font-mono-data text-[10px] md:text-[11px] tracking-[0.3em] text-steel-silver/40 uppercase">
            COMPATIBLE WITH TIER-1 FINANCIAL STANDARDS
          </h3>
        </motion.div>

        {/* Scrolling partners row */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex gap-4 md:gap-6 justify-center flex-wrap md:flex-nowrap md:justify-center"
          >
            {partners.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(0,255,65,0.3)",
                  boxShadow: "0 0 15px rgba(0,255,65,0.08)",
                }}
                className="flex items-center justify-center px-5 md:px-7 py-3 md:py-3.5 rounded border border-[rgba(255,255,255,0.06)] bg-panel transition-all duration-300 min-w-[120px] md:min-w-[140px]"
              >
                <span className="text-[10px] md:text-[11px] font-mono-data font-bold tracking-[0.15em] text-steel-silver/40">
                  {name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   4. STATS SECTION
   ──────────────────────────────────────────── */

const stats = [
  {
    value: "99.97%",
    label: "UPTIME",
    icon: Activity,
    suffix: "",
  },
  {
    value: "<50",
    label: "LATENCY",
    icon: Clock,
    suffix: "ms",
  },
  {
    value: "12M+",
    label: "TRANSACTIONS",
    icon: Zap,
    suffix: "",
  },
  {
    value: "47",
    label: "COUNTRIES",
    icon: Globe,
    suffix: "",
  },
];

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 md:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              custom={i * 0.1}
              whileHover={{
                borderColor: "rgba(0,255,65,0.25)",
                boxShadow: "0 0 20px rgba(0,255,65,0.05)",
              }}
              className="panel p-5 md:p-6 text-center transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded mx-auto mb-3 flex items-center justify-center bg-matrix-green/5 border border-matrix-green/10 group-hover:bg-matrix-green/10 transition-colors duration-300">
                <stat.icon className="w-4 h-4 text-matrix-green/60 group-hover:text-matrix-green transition-colors duration-300" />
              </div>
              <div className="font-mono-data text-2xl md:text-3xl lg:text-4xl font-bold text-matrix-green glow-green tracking-wide">
                {stat.value}
                {stat.suffix && (
                  <span className="text-lg md:text-xl ml-0.5 text-matrix-green/60">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-[9px] md:text-[10px] font-mono-data tracking-[0.25em] text-steel-silver/40 uppercase mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   5. CLOSING CTA SECTION
   ──────────────────────────────────────────── */

function ClosingCTA() {
  const { setPage } = useAtlasStore();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 md:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative panel p-8 md:p-12 lg:p-14 text-center overflow-hidden"
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,255,65,0.15), 0 0 40px rgba(0,255,65,0.04)",
          }}
        >
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-6 h-6">
            <div className="absolute top-0 left-0 w-4 h-px bg-matrix-green/30" />
            <div className="absolute top-0 left-0 h-4 w-px bg-matrix-green/30" />
          </div>
          <div className="absolute top-3 right-3 w-6 h-6">
            <div className="absolute top-0 right-0 w-4 h-px bg-matrix-green/30" />
            <div className="absolute top-0 right-0 h-4 w-px bg-matrix-green/30" />
          </div>
          <div className="absolute bottom-3 left-3 w-6 h-6">
            <div className="absolute bottom-0 left-0 w-4 h-px bg-matrix-green/30" />
            <div className="absolute bottom-0 left-0 h-4 w-px bg-matrix-green/30" />
          </div>
          <div className="absolute bottom-3 right-3 w-6 h-6">
            <div className="absolute bottom-0 right-0 w-4 h-px bg-matrix-green/30" />
            <div className="absolute bottom-0 right-0 h-4 w-px bg-matrix-green/30" />
          </div>

          {/* Subtle scanline */}
          <div className="scanline absolute inset-0 pointer-events-none" />

          {/* Content */}
          <span className="inline-block text-[10px] font-mono-data tracking-[0.3em] text-steel-silver/30 uppercase mb-4">
            {"// Begin"}
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono-data text-xl md:text-2xl lg:text-3xl font-bold text-matrix-green glow-green tracking-wide mb-4"
          >
            READY TO DEPLOY?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm text-steel-silver/50 max-w-lg mx-auto leading-relaxed mb-8"
          >
            Join the next generation of commerce infrastructure. Enterprise-grade
            reliability meets developer-first design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              onClick={() => setPage("command")}
              className="group relative px-10 py-3.5 bg-matrix-green text-obsidian font-mono-data text-xs md:text-sm font-bold tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,65,0.35)]"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2">
                INITIALIZE ONBOARDING
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          </motion.div>

          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,255,65,0.03) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   MAIN LANDING PAGE
   ──────────────────────────────────────────── */

export function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <HeroSection />
      <FeatureGridSection />
      <TrustBar />
      <StatsSection />
      <ClosingCTA />
    </div>
  );
}
