'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Route,
  Brain,
  LayoutGrid,
  Server,
  Shield,
  Activity,
  Globe,
  Zap,
  Lock,
  Database,
  Code,
  ArrowRight,
  Check,
  Layers,
  Cpu,
  Workflow,
} from 'lucide-react'
import { useAtlasStore } from '@/lib/store'

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
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ────────────────────────────────────────────
   SERVICES DATA
   ──────────────────────────────────────────── */

interface ServiceModule {
  id: string
  icon: React.ElementType
  tag: string
  title: string
  subtitle: string
  description: string
  accent: string
  capabilities: string[]
  techStack: string[]
  apiEndpoint?: string
}

const services: ServiceModule[] = [
  {
    id: 'payment-orchestration',
    icon: Route,
    tag: 'PAYMENT ORCHESTRATION',
    title: 'Payment Orchestration Layer',
    subtitle: 'Gateway-agnostic middleware for fee optimization',
    description:
      'The Payment Orchestration Layer acts as a unified middleware between merchants and multiple licensed payment gateways. It abstracts the complexity of multi-gateway integration into a single API endpoint, automatically optimizing approval rates, latency, and per-transaction costs. This middleware approach means merchants never need to manage individual gateway connections, API credentials, or failover logic — Atlas handles all routing decisions transparently while ensuring every transaction complies with the relevant jurisdiction requirements.',
    accent: '#00FF41',
    capabilities: [
      'Unified API for all payment gateways',
      'Automatic gateway failover and load balancing',
      'Real-time fee optimization across processors',
      'Multi-currency settlement (EUR, GBP, BRL, USD)',
      'Split routing by payment method (card, PIX, SEPA, iDEAL)',
      'Compliance injection per jurisdiction (EU/UK/BR)',
      'Transaction retry logic with cascading fallback',
      'Raw transaction logging for reconciliation',
    ],
    techStack: ['Node.js', 'Redis Cache', 'PostgreSQL', 'WebSocket'],
    apiEndpoint: 'POST /api/v2/payments/process',
  },
  {
    id: 'nexflowx',
    icon: Activity,
    tag: 'SMART ROUTING',
    title: 'NeXFlowX — Smart Routing Engine v2.1',
    subtitle: 'Decision logic based on geolocation, risk, and cost',
    description:
      'NeXFlowX is the intelligent routing engine that powers every transaction decision on the Atlas platform. It evaluates each transaction in real-time using a multi-factor decision tree: buyer geolocation, transaction risk profile, gateway availability and current latency, and processing cost. The engine continuously monitors gateway health across all regions and automatically adjusts routing rules to maximize approval rates while minimizing costs. Version 2.1 introduces predictive routing that learns from historical transaction patterns to pre-select the optimal gateway before the transaction is initiated.',
    accent: '#00F0FF',
    capabilities: [
      'Geolocation-based routing (BR \u2192 Stripe/Stark, EU \u2192 Stripe/Adyen, ELSE \u2192 UK)',
      'Risk-score weighted gateway selection',
      'Real-time gateway latency monitoring (< 50ms target)',
      'Automatic failover chain per merchant configuration',
      'Load balancing across active gateways',
      'Predictive routing using historical approval data',
      'Multi-region redundancy with zero-downtime switching',
      'Configurable routing rules via merchant dashboard',
    ],
    techStack: ['Node.js', 'Redis', 'PostgreSQL', 'WebSocket'],
    apiEndpoint: 'POST /api/v2/route',
  },
  {
    id: 'brain',
    icon: Brain,
    tag: 'BUSINESS INTELLIGENCE',
    title: 'The Brain — CRM & Analytics Platform',
    subtitle: 'Financial metrics control panel with predictive insights',
    description:
      'The Brain is the commercial intelligence platform within Atlas. It provides predictive analytics, customer segmentation, churn detection, and LTV (Lifetime Value) forecasting through behavioral data pipelines that process transaction signals in real-time. The unified dashboard presents all financial metrics — revenue, transaction volume, approval rates, chargeback ratios, and cohort retention — in a visual and exportable format. Automated anomaly alerts notify merchants of unusual patterns such as sudden spikes in declined transactions or shifts in customer behavior that may indicate competitive threats or fraud attempts.',
    accent: '#FFB800',
    capabilities: [
      'RFM Segmentation (Recency, Frequency, Monetary)',
      'Predictive churn detection (ML pipeline)',
      'LTV forecasting and recurring revenue projection',
      'Cohort analysis and retention by time period',
      'Automated anomaly alerts and risk notifications',
      'Customizable dashboards per merchant',
      'Report export (CSV, PDF, API streaming)',
      'Integration with external data warehouses (BigQuery, Snowflake)',
    ],
    techStack: ['Python', 'TensorFlow Lite', 'TimescaleDB', 'Grafana'],
    apiEndpoint: 'GET /api/v2/analytics/{merchant_id}',
  },
  {
    id: 'studio',
    icon: LayoutGrid,
    tag: 'SITE BUILDER',
    title: 'Atlas Studio — Commerce Builder',
    subtitle: 'Dynamic commercial interface generation via API',
    description:
      'Atlas Studio is an API-driven storefront and landing page builder. It enables the dynamic generation of complete commercial interfaces with automatic TSP (Technical Service Provider) compliance injection. Every storefront generated through Atlas Studio automatically includes the regulatory footer disclaimers required for the merchant\'s operating jurisdiction, ensuring both the merchant and Atlas maintain legal compliance across all served regions. The builder supports responsive layouts, customizable themes, API-managed product catalogs, and real-time preview across desktop and mobile viewports.',
    accent: '#FF0040',
    capabilities: [
      'REST API-driven page generation',
      '3 responsive layouts (Single Column, Grid, Hero)',
      'Dynamic product catalog management',
      'Automatic TSP compliance footer per jurisdiction',
      'Integrated A/B testing framework',
      'SEO optimization with dynamic meta tags',
      'Real-time desktop and mobile preview',
      'Publication webhook for CI/CD integration',
    ],
    techStack: ['React', 'Next.js', 'Prisma ORM', 'Edge CDN'],
    apiEndpoint: 'POST /api/v2/storefronts/generate',
  },
]

/* ────────────────────────────────────────────
   INFRASTRUCTURE SECTION
   ──────────────────────────────────────────── */

const infraLayers = [
  {
    icon: Globe,
    label: 'Edge Layer',
    description: 'CDN + Load Balancer across 4 regions (EU, UK, BR, US)',
    color: '#00FF41',
  },
  {
    icon: Server,
    label: 'Application Layer',
    description: 'Next.js 16 (Standalone) on Vercel Edge Network',
    color: '#00F0FF',
  },
  {
    icon: Database,
    label: 'Data Layer',
    description: 'Supabase PostgreSQL with Row Level Security (RLS)',
    color: '#FFB800',
  },
  {
    icon: Lock,
    label: 'Security Layer',
    description: 'TLS 1.3 + AES-256-GCM + SOC 2 Type II',
    color: '#FF0040',
  },
  {
    icon: Code,
    label: 'Integration Layer',
    description: 'REST API + WebSocket + Webhooks + SDK',
    color: '#C0C0C0',
  },
]

/* ────────────────────────────────────────────
   SERVICE DETAIL CARD
   ──────────────────────────────────────────── */

function ServiceCard({ service, index }: { service: ServiceModule; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      id={service.id}
      custom={index * 0.12}
      variants={scaleIn}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="panel overflow-hidden"
    >
      {/* Top accent */}
      <div
        className="h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${service.accent}60 0%, ${service.accent}10 50%, transparent 100%)`,
        }}
      />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `${service.accent}10`,
              border: `1px solid ${service.accent}20`,
            }}
          >
            <service.icon className="w-6 h-6" style={{ color: service.accent }} />
          </div>
          <div className="min-w-0">
            <span
              className="text-[9px] font-mono-data tracking-[0.25em] block mb-1.5"
              style={{ color: `${service.accent}60` }}
            >
              {service.tag}
            </span>
            <h3 className="font-mono-data text-base md:text-lg font-bold text-[#C0C0C0] tracking-wide mb-1">
              {service.title}
            </h3>
            <p
              className="text-xs font-mono-data tracking-wider"
              style={{ color: `${service.accent}80` }}
            >
              {service.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#C0C0C0]/55 leading-[1.8] mb-6">
          {service.description}
        </p>

        {/* Two columns: Capabilities + Tech */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capabilities */}
          <div>
            <h4 className="text-[10px] font-mono-data tracking-[0.2em] text-[#6B7280] uppercase mb-3 flex items-center gap-2">
              <Check className="w-3 h-3" style={{ color: service.accent }} />
              Capabilities
            </h4>
            <ul className="space-y-2">
              {service.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div
                    className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                    style={{ background: `${service.accent}50` }}
                  />
                  <span className="text-xs text-[#C0C0C0]/50 leading-relaxed">
                    {cap}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-[10px] font-mono-data tracking-[0.2em] text-[#6B7280] uppercase mb-3 flex items-center gap-2">
              <Cpu className="w-3 h-3" style={{ color: service.accent }} />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {service.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono-data px-2.5 py-1 rounded"
                  style={{
                    background: `${service.accent}08`,
                    border: `1px solid ${service.accent}15`,
                    color: `${service.accent}80`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            {service.apiEndpoint && (
              <div className="panel-light p-3">
                <span className="text-[9px] font-mono-data text-[#6B7280] tracking-wider block mb-1">
                  API ENDPOINT
                </span>
                <code className="text-xs font-mono-data" style={{ color: service.accent }}>
                  {service.apiEndpoint}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   SERVICE NAV PILLS
   ──────────────────────────────────────────── */

function ServiceNavPills() {
  const quickLinks = [
    { label: 'ORCHESTRATION', color: '#00FF41', target: 'payment-orchestration' },
    { label: 'NEXFLOWX', color: '#00F0FF', target: 'nexflowx' },
    { label: 'BRAIN CRM', color: '#FFB800', target: 'brain' },
    { label: 'STUDIO', color: '#FF0040', target: 'studio' },
  ]

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {quickLinks.map((link) => (
        <button
          key={link.target}
          onClick={() => {
            const el = document.getElementById(link.target)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:shadow-lg"
          style={{
            borderColor: `${link.color}25`,
            background: `${link.color}05`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${link.color}50`
            e.currentTarget.style.background = `${link.color}10`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${link.color}25`
            e.currentTarget.style.background = `${link.color}05`
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: link.color }} />
          <span className="text-[10px] font-mono-data tracking-[0.15em]" style={{ color: `${link.color}90` }}>
            {link.label}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   MAIN SERVICES PAGE
   ──────────────────────────────────────────── */

export function ServicesPage() {
  const { setPage } = useAtlasStore()
  const infraRef = useRef<HTMLDivElement>(null)
  const infraInView = useInView(infraRef, { once: true, margin: '-80px' })

  return (
    <div className="min-h-screen bg-obsidian">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="pt-20 pb-6 px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[10px] font-mono-data tracking-[0.3em] text-[#00F0FF]/60 uppercase mb-4">
            {'// Architecture Overview'}
          </span>
          <h1 className="font-mono-data text-2xl md:text-3xl lg:text-4xl font-bold text-[#C0C0C0] tracking-wide mb-4">
            TECHNICAL SERVICES
          </h1>
          <p className="text-sm text-[#C0C0C0]/50 max-w-2xl mx-auto leading-relaxed mb-8">
            Atlas provides software infrastructure (SaaS) for payment orchestration,
            commercial intelligence, and dynamic interface generation. We are not a bank
            or payment processor — we are the technology layer connecting merchants to licensed gateways.
          </p>
          <ServiceNavPills />
        </motion.div>
      </div>

      {/* ── TSP Disclaimer ──────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="panel-light p-5 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFB800]" />
          <div className="flex items-start gap-3 ml-3">
            <Shield className="w-5 h-5 text-[#FFB800] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono-data text-xs tracking-[0.15em] text-[#FFB800] mb-2">
                NATURE OF SERVICE
              </h4>
              <p className="text-sm text-[#C0C0C0]/60 leading-relaxed">
                Atlas Global Core is a <strong className="text-[#C0C0C0]/80">Technical Service Provider (TSP)</strong>.
                We do not hold, process, or transmit payment card data directly. All financial processing
                is conducted exclusively through licensed and regulated financial institutions (Stripe, Adyen,
                Stark Bank, etc.). Atlas provides intelligent routing, CRM infrastructure, and commercial
                storefront building tools.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Service Modules ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-8">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>

      {/* ── Infrastructure Stack ─────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12" ref={infraRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={infraInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-[10px] font-mono-data tracking-[0.3em] text-[#C0C0C0]/30 uppercase mb-3 block">
            {'// Infrastructure'}
          </span>
          <h2 className="font-mono-data text-lg md:text-xl font-bold text-[#C0C0C0] tracking-wide">
            INFRASTRUCTURE STACK
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={infraInView ? 'visible' : 'hidden'}
          className="space-y-3"
        >
          {infraLayers.map((layer, i) => (
            <motion.div
              key={layer.label}
              variants={fadeUp}
              custom={0.05 + i * 0.08}
              className="flex items-center gap-4 panel-light p-4"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${layer.color}10`,
                  border: `1px solid ${layer.color}20`,
                }}
              >
                <layer.icon className="w-5 h-5" style={{ color: layer.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-mono-data text-xs font-bold text-[#C0C0C0] tracking-wider mb-0.5">
                  {layer.label}
                </h4>
                <p className="text-xs text-[#6B7280] tracking-wide">
                  {layer.description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                {[0, 1, 2].map((bar) => (
                  <div
                    key={bar}
                    className="w-6 h-1.5 rounded-full"
                    style={{
                      background: `${layer.color}${i >= 2 ? '60' : '30'}`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom Stats ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Activity, value: '99.97%', label: 'UPTIME SLA', color: '#00FF41' },
            { icon: Zap, value: '<50ms', label: 'ROUTING LATENCY', color: '#00F0FF' },
            { icon: Layers, value: '8+', label: 'GATEWAYS', color: '#FFB800' },
            { icon: Workflow, value: '4', label: 'REGIONS', color: '#FF0040' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={scaleIn}
              custom={i * 0.1}
              className="panel p-5 text-center"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: `${stat.color}60` }} />
              <p className="font-mono-data text-xl md:text-2xl font-bold tracking-wide mb-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[9px] font-mono-data text-[#6B7280] tracking-[0.2em] uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="panel p-8 text-center relative overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px rgba(0,240,255,0.1), 0 0 30px rgba(0,240,255,0.03)',
          }}
        >
          <div className="scanline absolute inset-0 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[9px] font-mono-data tracking-[0.3em] text-[#C0C0C0]/30 uppercase mb-3 block">
              {'// Next Step'}
            </span>
            <h3 className="font-mono-data text-lg font-bold text-[#00F0FF] glow-blue tracking-wide mb-3">
              READY TO INTEGRATE?
            </h3>
            <p className="text-xs text-[#C0C0C0]/50 max-w-lg mx-auto leading-relaxed mb-5">
              Access Atlas Command to configure your account, complete KYB verification,
              and start orchestrating transactions in minutes.
            </p>
            <motion.button
              onClick={() => setPage('command')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#00F0FF]/50 text-[#00F0FF] font-mono-data text-xs font-bold tracking-[0.15em] rounded transition-all hover:bg-[#00F0FF]/5 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
            >
              ACCESS COMMAND
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
