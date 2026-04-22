"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Route,
  Brain,
  LayoutGrid,
  Activity,
  Zap,
  Globe,
  Clock,
  ArrowRight,
  ChevronRight,
  Cpu,
  Shield,
  Workflow,
  Fingerprint,
  Timer,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Network,
  Database,
  FileCode,
  Lock,
  ArrowDownRight,
  ArrowUpRight,
  CircleDot,
  Bitcoin,
  Landmark,
  Hexagon,
  Layers,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";
import { LivingBackground } from "./living-background";
import { NeXFlowXCompanion } from "./nexflowx-companion";

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
   LIVE PULSE INDICATOR
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
          Live Settlement Throughput
        </span>
        <span className="text-sm font-mono-data text-matrix-green glow-green font-bold tracking-wide">
          {count} tx/sec
        </span>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   1. HERO SECTION (Updated)
   ──────────────────────────────────────────── */

function HeroSection() {
  const { setPage } = useAtlasStore();
  const [displayText, setDisplayText] = useState("");
  const fullText =
    "THE CONTEXT-AWARE ORCHESTRATION LAYER FOR THE GLOBAL AGENTIC ECONOMY";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 28);
    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="relative min-h-screen pt-14 flex flex-col items-center justify-center overflow-hidden">
      {/* Living Background */}
      <LivingBackground />

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
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(57,255,20,0.15)] bg-[rgba(57,255,20,0.04)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-matrix-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-matrix-green" />
            </span>
            <span className="text-[10px] md:text-[11px] font-mono-data tracking-[0.2em] text-matrix-green/80 uppercase">
              Infrastructure v3.0 — Agentic Economy Ready
            </span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="font-mono-data text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold tracking-wide leading-tight text-matrix-green glow-green mb-6"
        >
          {displayText}
          <motion.span
            animate={{ opacity: showCursor ? 1 : 0 }}
            transition={{ duration: 0.1 }}
            className="inline-block w-[3px] h-[0.85em] bg-matrix-green ml-1 align-middle"
            style={{ boxShadow: "0 0 8px rgba(57,255,20,0.6)" }}
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="text-sm md:text-base lg:text-lg text-steel-silver/70 max-w-3xl mx-auto leading-relaxed mb-10"
        >
          AI-driven liquidity routing, real-time dynamic compliance, and
          seamless B2B settlement across{" "}
          <span className="text-cyber-blue glow-blue">Fiat</span> and{" "}
          <span className="text-matrix-green glow-green">Crypto</span>{" "}
          networks.
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
            className="group relative px-8 py-3 bg-matrix-green text-obsidian font-mono-data text-xs md:text-sm font-bold tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,255,20,0.3)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center gap-2">
              ACCESS THE INFRASTRUCTURE
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
              EXPLORE THE ENGINE
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
          <span>POWERED BY NEXFLOWX AI-ENGINE</span>
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
   2. NEXFLOWX AI-ENGINE SECTION
   ──────────────────────────────────────────── */

const aiVariables = [
  {
    icon: Globe,
    label: "JURISDICTION",
    detail: "EU / UK / BR / Global",
    color: "text-cyber-blue",
    bgColor: "bg-cyber-blue/10",
    borderColor: "border-cyber-blue/20",
  },
  {
    icon: Timer,
    label: "TIME-ZONE",
    detail: "Real-time UTC offset",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
  {
    icon: Droplets,
    label: "LIQUIDITY",
    detail: "Pool depth analysis",
    color: "text-matrix-green",
    bgColor: "bg-matrix-green/10",
    borderColor: "border-matrix-green/20",
  },
  {
    icon: AlertTriangle,
    label: "RISK SCORE",
    detail: "Dynamic AML/KYC signal",
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/20",
  },
];

const routingDecisions = [
  {
    provider: "Viva.com",
    protocol: "SEPA Europe",
    icon: Landmark,
    description: "Optimal for EU-based B2B settlements. SEPA Instant, low latency, PSD2-compliant. Fiat-only corridor.",
    tags: ["EUR", "SEPA", "EU"],
    color: "border-cyber-blue/20",
    glowColor: "rgba(0,240,255,0.06)",
    iconColor: "text-cyber-blue",
  },
  {
    provider: "Onramp.money",
    protocol: "USDT Global Settlement",
    icon: Bitcoin,
    description: "Cross-border crypto settlement via USDT. 24/7 availability, no banking hours. Global reach.",
    tags: ["USDT", "CRYPTO", "GLOBAL"],
    color: "border-matrix-green/20",
    glowColor: "rgba(57,255,20,0.06)",
    iconColor: "text-matrix-green",
  },
];

function AiVariableCard({ variable, index }: { variable: (typeof aiVariables)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      custom={index * 0.1}
      variants={scaleIn}
      initial="hidden"
      animate={controls}
      whileHover={{
        y: -4,
        transition: { duration: 0.25 },
      }}
      className="group relative panel p-4 md:p-5 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${variable.bgColor} border ${variable.borderColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <variable.icon className={`w-4 h-4 ${variable.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-[9px] font-mono-data tracking-[0.25em] ${variable.color} uppercase block mb-1`}>
            {variable.label}
          </span>
          <span className="text-xs text-steel-silver/50 font-mono-data">
            {variable.detail}
          </span>
        </div>
      </div>
      {/* Signal bar animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent to-transparent"
        style={{ right: "50%" }}
        animate={{
          background: [
            "linear-gradient(90deg, transparent, transparent)",
            `linear-gradient(90deg, transparent, ${variable.color === "text-matrix-green" ? "rgba(57,255,20,0.4)" : variable.color === "text-cyber-blue" ? "rgba(0,240,255,0.4)" : variable.color === "text-warning" ? "rgba(255,184,0,0.4)" : "rgba(255,0,64,0.4)"})`,
            "linear-gradient(90deg, transparent, transparent)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: index * 0.8,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

function RoutingDecisionCard({ decision, index }: { decision: (typeof routingDecisions)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
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
      className={`group relative panel p-5 md:p-6 border ${decision.color} transition-all duration-300`}
      style={{ boxShadow: `0 0 30px ${decision.glowColor}` }}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent ${decision.iconColor === "text-cyber-blue" ? "via-cyber-blue/30" : "via-matrix-green/30"} to-transparent group-hover:opacity-100 opacity-50 transition-opacity duration-500`} />

      {/* Provider header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${decision.glowColor} border ${decision.color}`}>
          <decision.icon className={`w-5 h-5 ${decision.iconColor}`} />
        </div>
        <div>
          <h3 className="font-mono-data text-sm md:text-base font-bold text-steel-silver tracking-wide">
            {decision.provider}
          </h3>
          <span className="text-[9px] font-mono-data tracking-[0.2em] text-steel-silver/40 uppercase">
            {decision.protocol}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-steel-silver/50 leading-relaxed mb-4">
        {decision.description}
      </p>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {decision.tags.map((tag) => (
          <span
            key={tag}
            className="text-[8px] font-mono-data tracking-[0.15em] px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-steel-silver/40"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Corner decoration */}
      <div className="absolute bottom-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute bottom-0 right-0 w-4 h-px ${decision.iconColor === "text-cyber-blue" ? "bg-cyber-blue/40" : "bg-matrix-green/40"}`} />
        <div className={`absolute bottom-0 right-0 h-4 w-px ${decision.iconColor === "text-cyber-blue" ? "bg-cyber-blue/40" : "bg-matrix-green/40"}`} />
      </div>
    </motion.div>
  );
}

function NexFlowXEngineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(57,255,20,0.02) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block text-[10px] md:text-[11px] font-mono-data tracking-[0.3em] text-steel-silver/30 uppercase mb-3">
            {"// Core Engine"}
          </span>
          <h2 className="font-mono-data text-xl md:text-2xl lg:text-3xl font-bold text-matrix-green glow-green tracking-wide mb-4">
            NEXFLOWX AI-ENGINE
          </h2>
          <p className="text-sm text-steel-silver/50 max-w-2xl mx-auto leading-relaxed">
            Context-Aware Orchestration — our AI analyzes multi-dimensional signals in real-time
            to determine the optimal settlement route for every B2B transaction.
          </p>
        </motion.div>

        {/* Input Variables Grid */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-6 h-6 rounded bg-matrix-green/10 border border-matrix-green/20 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5 text-matrix-green" />
            </div>
            <span className="text-[10px] font-mono-data tracking-[0.25em] text-steel-silver/50 uppercase">
              Input Signals — Analyzed in &lt;50ms
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiVariables.map((variable, index) => (
              <AiVariableCard key={variable.label} variable={variable} index={index} />
            ))}
          </div>
        </div>

        {/* Central Processing Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative my-12 flex flex-col items-center"
        >
          {/* Connection lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-steel-silver/10 to-matrix-green/30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-matrix-green/30 to-steel-silver/10" />

          {/* Engine core */}
          <div className="relative px-8 py-5 rounded-lg" style={{ background: "rgba(57,255,20,0.03)", border: "1px solid rgba(57,255,20,0.12)", boxShadow: "0 0 40px rgba(57,255,20,0.04)" }}>
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3"
            >
              <Brain className="w-5 h-5 text-matrix-green" />
              <span className="text-xs font-mono-data text-matrix-green glow-green font-bold tracking-widest">
                NEXFLOWX CONTEXT ENGINE
              </span>
              <Brain className="w-5 h-5 text-matrix-green" />
            </motion.div>
            <div className="mt-2 text-center">
              <span className="text-[9px] font-mono-data text-steel-silver/40 tracking-wider">
                Multi-variable scoring &middot; Dynamic corridor selection &middot; Compliance pre-check
              </span>
            </div>

            {/* Animated processing indicator */}
            <div className="absolute -top-1 -right-1">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 rounded-full bg-matrix-green/60"
                style={{ boxShadow: "0 0 8px rgba(57,255,20,0.4)" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Routing Decision Output */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-6 h-6 rounded bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyber-blue" />
            </div>
            <span className="text-[10px] font-mono-data tracking-[0.25em] text-steel-silver/50 uppercase">
              Routing Decision — Dynamic Output
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {routingDecisions.map((decision, index) => (
              <RoutingDecisionCard key={decision.provider} decision={decision} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   3. PRIVATE B2B MARKETPLACE
   ──────────────────────────────────────────── */

const marketplacePillars = [
  {
    icon: Cpu,
    title: "Compute Power",
    subtitle: "GPU Reselling Infrastructure",
    description:
      "Verified GPU compute providers. Atlas acts as the escrow and settlement layer for high-value compute transactions. Real-time capacity verification, automated provisioning, and trustless settlement via smart escrow.",
    features: ["Verified Providers", "Smart Escrow", "Capacity Verification", "Auto-Provisioning"],
    color: "cyber-blue",
    accentColor: "rgba(0,240,255,0.1)",
    borderColor: "rgba(0,240,255,0.15)",
    iconBg: "bg-cyber-blue/10",
    iconBorder: "border-cyber-blue/20",
    iconText: "text-cyber-blue",
  },
  {
    icon: Workflow,
    title: "Agentic Workflows",
    subtitle: "Pre-built AI Agent Pipelines",
    description:
      "Marketplace for deployable AI agent workflows. Buy, sell, and compose agentic pipelines for B2B automation. Each workflow is verified, versioned, and settled through Atlas Core infrastructure.",
    features: ["Verified Workflows", "Composable Agents", "Version Control", "Usage Metering"],
    color: "matrix-green",
    accentColor: "rgba(57,255,20,0.1)",
    borderColor: "rgba(57,255,20,0.15)",
    iconBg: "bg-matrix-green/10",
    iconBorder: "border-matrix-green/20",
    iconText: "text-matrix-green",
  },
  {
    icon: FileCode,
    title: "Digital IP Assets",
    subtitle: "High-Value Technology Assets",
    description:
      "Tokenizable digital intellectual property — models, datasets, algorithms, and proprietary technology. Protected by cryptographic provenance and settled through our escrow engine.",
    features: ["IP Provenance", "Crypto Attestation", "License Management", "Royalty Settlement"],
    color: "warning",
    accentColor: "rgba(255,184,0,0.1)",
    borderColor: "rgba(255,184,0,0.15)",
    iconBg: "bg-warning/10",
    iconBorder: "border-warning/20",
    iconText: "text-warning",
  },
];

function MarketplacePillarCard({ pillar, index }: { pillar: (typeof marketplacePillars)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
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
      className="group relative panel p-6 md:p-8 transition-all duration-300"
      style={{ borderColor: pillar.borderColor }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent group-hover:via-steel-silver/20 transition-all duration-500" />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${pillar.iconBg} border ${pillar.iconBorder} mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <pillar.icon className={`w-6 h-6 ${pillar.iconText}`} />
      </div>

      {/* Title & Subtitle */}
      <h3 className="font-mono-data text-sm md:text-base font-bold text-steel-silver tracking-wide mb-1">
        {pillar.title}
      </h3>
      <span className="text-[9px] font-mono-data tracking-[0.2em] text-steel-silver/40 uppercase block mb-4">
        {pillar.subtitle}
      </span>

      {/* Description */}
      <p className="text-xs text-steel-silver/50 leading-relaxed mb-5">
        {pillar.description}
      </p>

      {/* Features list */}
      <div className="grid grid-cols-2 gap-2">
        {pillar.features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 text-[9px] font-mono-data text-steel-silver/40 tracking-wider"
          >
            <CircleDot className={`w-2.5 h-2.5 ${pillar.iconText} opacity-50 shrink-0`} />
            {feature}
          </div>
        ))}
      </div>

      {/* Background glow on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${pillar.accentColor} 0%, transparent 70%)` }}
      />
    </motion.div>
  );
}

function B2BMarketplaceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-steel-silver/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-block text-[10px] md:text-[11px] font-mono-data tracking-[0.3em] text-steel-silver/30 uppercase mb-3">
            {"// Ecosystem"}
          </span>
          <h2 className="font-mono-data text-xl md:text-2xl lg:text-3xl font-bold text-cyber-blue glow-blue tracking-wide mb-4">
            PRIVATE B2B MARKETPLACE
          </h2>
          <p className="text-sm text-steel-silver/50 max-w-2xl mx-auto leading-relaxed">
            A closed ecosystem for high-value technology services. Atlas Core acts as the central
            financial hub — providing escrow, verification, and settlement for every transaction.
          </p>
        </motion.div>

        {/* Financial Hub Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 panel p-5 flex flex-col sm:flex-row items-center gap-4"
          style={{ borderColor: "rgba(57,255,20,0.1)", boxShadow: "0 0 30px rgba(57,255,20,0.02)" }}
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-matrix-green/10 border border-matrix-green/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-matrix-green" />
            </div>
            <div>
              <span className="text-xs font-mono-data text-matrix-green font-bold tracking-wider block">
                ATLAS AS FINANCIAL HUB
              </span>
              <span className="text-[9px] font-mono-data text-steel-silver/40 tracking-wider">
                Escrow &middot; Verification &middot; Settlement
              </span>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-steel-silver/10" />
          <p className="text-xs text-steel-silver/50 leading-relaxed text-center sm:text-left">
            Every marketplace transaction is escrowed, identity-verified, and settled through the NeXFlowX engine.
            Trustless, auditable, and compliant across all jurisdictions.
          </p>
        </motion.div>

        {/* Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {marketplacePillars.map((pillar, index) => (
            <MarketplacePillarCard key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   4. CORE MODULES (Updated Feature Grid)
   ──────────────────────────────────────────── */

const features = [
  {
    icon: Route,
    title: "NeXFlowX Routing Engine",
    description:
      "Intelligent transaction routing across multiple payment gateways. Automatic failover, load balancing, and real-time latency optimization. Supports Stripe, Viva Wallet, Onramp.money, and cryptocurrency processors.",
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
    if (isInView) controls.start("visible");
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
   5. TRUST BAR
   ──────────────────────────────────────────── */

const partners = [
  "STRIPE",
  "VIVA.COM",
  "ONRAMP.MONEY",
  "TON",
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

        {/* Partners row */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex gap-4 md:gap-6 justify-center flex-wrap md:flex-nowrap"
          >
            {partners.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(57,255,20,0.3)",
                  boxShadow: "0 0 15px rgba(57,255,20,0.08)",
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
   6. STATS SECTION
   ──────────────────────────────────────────── */

const stats = [
  { value: "99.97%", label: "UPTIME", icon: Activity, suffix: "" },
  { value: "<50", label: "LATENCY", icon: Clock, suffix: "ms" },
  { value: "12M+", label: "TRANSACTIONS", icon: Zap, suffix: "" },
  { value: "47", label: "COUNTRIES", icon: Globe, suffix: "" },
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
                borderColor: "rgba(57,255,20,0.25)",
                boxShadow: "0 0 20px rgba(57,255,20,0.05)",
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
   7. CLOSING CTA SECTION
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
              "0 0 0 1px rgba(57,255,20,0.15), 0 0 40px rgba(57,255,20,0.04)",
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

          {/* Scanline */}
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
            Join the next generation of agentic commerce infrastructure. Enterprise-grade
            reliability meets developer-first design. AI-driven, context-aware, and built for the global economy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              onClick={() => setPage("command")}
              className="group relative px-10 py-3.5 bg-matrix-green text-obsidian font-mono-data text-xs md:text-sm font-bold tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_40px_rgba(57,255,20,0.35)]"
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
                "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(57,255,20,0.03) 0%, transparent 70%)",
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
      <NexFlowXEngineSection />
      <B2BMarketplaceSection />
      <FeatureGridSection />
      <TrustBar />
      <StatsSection />
      <ClosingCTA />
      <NeXFlowXCompanion />
    </div>
  );
}
