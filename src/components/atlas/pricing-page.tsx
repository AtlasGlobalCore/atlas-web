'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import {
  Check,
  ArrowRight,
  Shield,
  Zap,
  Building2,
  Circle,
  ChevronRight,
  Server,
  Lock,
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
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
   PRICING TIERS DATA
   ──────────────────────────────────────────── */

interface PricingTier {
  name: string
  tag: string
  price: string
  priceSuffix: string
  volume: string
  description: string
  accent: string
  features: string[]
  cta: string
  popular: boolean
  icon: React.ElementType
}

const tiers: PricingTier[] = [
  {
    name: 'STARTER',
    tag: 'CORE',
    price: '\u20AC59',
    priceSuffix: '/month',
    volume: 'Up to \u20AC10,000/month processing volume',
    description: 'For emerging businesses that need reliable payment infrastructure with intelligent routing and essential CRM tools. The ideal entry point into the Atlas ecosystem.',
    accent: '#00F0FF',
    features: [
      '1 Storefront (Atlas Studio)',
      'Brain CRM \u2014 Basic Analytics',
      'NeXFlowX Standard Routing',
      'Gateway: Stripe + 1 additional',
      'Single currency (EUR)',
      'Automatic TSP compliance injection',
      'Real-time metrics dashboard',
      'Email support (48h SLA)',
    ],
    cta: 'START NOW',
    popular: false,
    icon: Zap,
  },
  {
    name: 'BUSINESS',
    tag: 'PROFESSIONAL',
    price: '\u20AC159',
    priceSuffix: '/month',
    volume: 'Up to \u20AC60,000/month processing volume',
    description: 'For scale operations requiring multi-gateway routing, advanced CRM with automation, and multi-currency coverage. The preferred choice for merchants with global ambition.',
    accent: '#00FF41',
    features: [
      'Multi-Storefront (up to 5)',
      'Brain CRM \u2014 Advanced Automation',
      'Priority NeXFlowX Routing',
      'Multi-currency: EUR / GBP / BRL',
      'All gateways activated',
      'Customer segmentation & churn detection',
      'Jurisdiction-aware compliance (EU/UK/BR)',
      'Dedicated API with elevated rate limits',
      'Priority support (12h SLA)',
      'Real-time webhooks',
    ],
    cta: 'ACTIVATE BUSINESS',
    popular: true,
    icon: Building2,
  },
  {
    name: 'ENTERPRISE',
    tag: 'GLOBAL CORE',
    price: 'Custom',
    priceSuffix: '',
    volume: 'Unlimited processing volume',
    description: 'For organizations that demand full control. Complete whitelabel, dedicated infrastructure, and 24/7 support. The definitive solution for large-scale payment processors and marketplaces.',
    accent: '#FFB800',
    features: [
      'Full whitelabel (your own branding)',
      'Dedicated VPS for processing',
      'Brain CRM \u2014 Complete Predictive Analytics',
      'NeXFlowX \u2014 Custom routing rules',
      'All currencies and regions',
      '99.99% uptime SLA guaranteed',
      'Integration via API + dedicated SDK',
      'Dedicated account manager',
      '24/7 support (1h SLA)',
      'Security audit included',
      'PCI-DSS Self-Assessment support',
      'Custom multi-region deployment',
    ],
    cta: 'CONTACT SALES',
    popular: false,
    icon: Shield,
  },
]

/* ────────────────────────────────────────────
   PRICING CARD COMPONENT
   ──────────────────────────────────────────── */

function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const controls = useAnimation()

  useState(() => {
    if (isInView) controls.start('visible')
  })

  const TierIcon = tier.icon

  return (
    <motion.div
      ref={ref}
      custom={index * 0.15}
      variants={scaleIn}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={`relative group flex flex-col panel overflow-hidden ${
        tier.popular ? 'glow-border-green' : ''
      }`}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-[#00FF41] text-[#050505] text-[8px] font-mono-data font-bold tracking-[0.2em] px-3 py-1 rounded-bl-lg">
            MOST POPULAR
          </div>
        </div>
      )}

      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${tier.accent}80 50%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{
                background: `${tier.accent}12`,
                border: `1px solid ${tier.accent}25`,
              }}
            >
              <TierIcon className="w-4 h-4" style={{ color: tier.accent }} />
            </div>
            <span
              className="text-[9px] font-mono-data tracking-[0.25em] font-bold"
              style={{ color: `${tier.accent}70` }}
            >
              {tier.tag}
            </span>
          </div>

          <h3 className="font-mono-data text-lg md:text-xl font-bold text-[#C0C0C0] tracking-wide mb-2">
            {tier.name}
          </h3>

          <p className="text-xs text-[#C0C0C0]/50 leading-relaxed mb-5">
            {tier.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-1">
            <span
              className="text-3xl md:text-4xl font-mono-data font-bold tracking-wide"
              style={{ color: tier.accent }}
            >
              {tier.price}
            </span>
            {tier.priceSuffix && (
              <span className="text-sm text-[#C0C0C0]/40 font-mono-data">
                {tier.priceSuffix}
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono-data text-[#6B7280] tracking-wider">
            {tier.volume}
          </p>
        </div>

        {/* Separator */}
        <div className="h-px bg-[rgba(255,255,255,0.06)] mb-6" />

        {/* Features */}
        <div className="flex-1 mb-8">
          <ul className="space-y-3">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  style={{ color: tier.accent }}
                />
                <span className="text-xs text-[#C0C0C0]/60 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded font-mono-data text-xs font-bold tracking-[0.15em] transition-all duration-300"
          style={{
            background: tier.popular
              ? tier.accent
              : 'transparent',
            color: tier.popular ? '#050505' : tier.accent,
            border: `1px solid ${tier.accent}${tier.popular ? '' : '40'}`,
            boxShadow: tier.popular
              ? `0 0 25px ${tier.accent}20`
              : 'none',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            {tier.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   TRUST INDICATORS
   ──────────────────────────────────────────── */

function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      label: 'PCI-DSS Compliant',
      sub: 'TSP Architecture',
    },
    {
      icon: Lock,
      label: 'AES-256 Encrypted',
      sub: 'Data at Rest & Transit',
    },
    {
      icon: Server,
      label: '99.97% Uptime',
      sub: 'Multi-Region Redundancy',
    },
    {
      icon: Zap,
      label: '<50ms Latency',
      sub: 'Edge Processing',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {indicators.map((ind, i) => (
        <motion.div
          key={ind.label}
          variants={fadeUp}
          custom={0.1 + i * 0.08}
          className="panel-light p-4 text-center"
        >
          <ind.icon className="w-5 h-5 text-[#00F0FF]/60 mx-auto mb-2" />
          <p className="text-[10px] font-mono-data text-[#C0C0C0] tracking-wider font-bold mb-0.5">
            {ind.label}
          </p>
          <p className="text-[9px] font-mono-data text-[#6B7280] tracking-wider">
            {ind.sub}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   FAQ SECTION
   ──────────────────────────────────────────── */

const faqItems = [
  {
    q: 'Can I change my plan at any time?',
    a: 'Yes. You can upgrade or downgrade your plan at any time. Changes are applied pro-rata to the current billing cycle. There are no penalties for changing plans.',
  },
  {
    q: 'Are there additional fees beyond the subscription?',
    a: 'The monthly price covers the Atlas platform as a service (SaaS). Payment processing fees are charged directly by the licensed gateways (Stripe, Adyen, etc.) according to your individual contracts with each processor. Atlas does not charge commission on transactions.',
  },
  {
    q: 'How does the included monthly volume work?',
    a: 'The monthly volume refers to the total value of transactions processed through the NeXFlowX Routing Engine during the billing period. Starter includes up to \u20AC10,000, Business up to \u20AC60,000, and Enterprise is unlimited. Excess volumes on Starter/Business are subject to negotiation.',
  },
  {
    q: 'What happens when the volume is exceeded?',
    a: 'You will receive a notification in your command dashboard when you reach 80% of the included volume. For Starter, you can upgrade immediately. For Business, contact your account manager. Enterprise has no limits.',
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {faqItems.map((item, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          custom={0.1 + i * 0.06}
          className="panel overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-xs font-mono-data text-[#C0C0C0] tracking-wide pr-4">
              {item.q}
            </span>
            <ChevronRight
              className={`w-4 h-4 text-[#00F0FF]/60 shrink-0 transition-transform duration-200 ${
                openIndex === i ? 'rotate-90' : ''
              }`}
            />
          </button>
          {openIndex === i && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-5 pb-4 border-t border-[rgba(255,255,255,0.04)]">
                <p className="text-xs text-[#C0C0C0]/50 leading-relaxed pt-3">
                  {item.a}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   BILLING CLARITY SECTION
   ──────────────────────────────────────────── */

function BillingClarity() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        {
          label: 'PLATFORM FEE',
          desc: 'Monthly SaaS subscription for Atlas infrastructure. Covers routing engine, CRM, storefront builder, and dashboard access.',
          accent: '#00F0FF',
        },
        {
          label: 'GATEWAY FEES',
          desc: 'Transaction fees are charged directly by licensed financial institutions (Stripe, Adyen, Stark Bank). Atlas takes zero commission.',
          accent: '#00FF41',
        },
        {
          label: 'NO HIDDEN COSTS',
          desc: 'No setup fees, no per-transaction surcharges from Atlas, no long-term commitment required. Cancel anytime with 30 days notice.',
          accent: '#FFB800',
        },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          variants={fadeUp}
          custom={0.05 + i * 0.1}
          className="panel p-5"
        >
          <div
            className="text-[10px] font-mono-data tracking-[0.2em] font-bold mb-3"
            style={{ color: item.accent }}
          >
            {item.label}
          </div>
          <p className="text-xs text-[#C0C0C0]/50 leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   MAIN PRICING PAGE
   ──────────────────────────────────────────── */

export function PricingPage() {
  const { setPage } = useAtlasStore()
  const sectionRef = useRef<HTMLDivElement>(null)

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
            {'// SaaS Subscriptions'}
          </span>
          <h1 className="font-mono-data text-2xl md:text-3xl lg:text-4xl font-bold text-[#C0C0C0] tracking-wide mb-4">
            PRICING <span className="text-[#00F0FF] glow-blue">&</span> PLANS
          </h1>
          <p className="text-sm text-[#C0C0C0]/50 max-w-2xl mx-auto leading-relaxed">
            Payment infrastructure by subscription. Zero transaction commissions.
            Pay only for the platform — processing is handled directly with licensed gateways.
          </p>
        </motion.div>
      </div>

      {/* ── Trust Indicators ─────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <TrustIndicators />
        </motion.div>
      </div>

      {/* ── Pricing Cards ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16" ref={sectionRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {tiers.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </div>

      {/* ── Billing Clarity ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-[10px] font-mono-data tracking-[0.3em] text-[#C0C0C0]/30 uppercase mb-3 block">
            {'// Transparent Billing'}
          </span>
          <h2 className="font-mono-data text-base md:text-lg font-bold text-[#C0C0C0] tracking-wide">
            HOW BILLING WORKS
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <BillingClarity />
        </motion.div>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="panel p-6 md:p-8 text-center relative overflow-hidden"
          style={{
            boxShadow: '0 0 0 1px rgba(0,255,65,0.1), 0 0 30px rgba(0,255,65,0.03)',
          }}
        >
          <div className="scanline absolute inset-0 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[9px] font-mono-data tracking-[0.3em] text-[#C0C0C0]/30 uppercase mb-3 block">
              {'// Integration'}
            </span>
            <h3 className="font-mono-data text-lg font-bold text-[#00FF41] glow-green tracking-wide mb-3">
              NEED A CUSTOM PROPOSAL?
            </h3>
            <p className="text-xs text-[#C0C0C0]/50 max-w-lg mx-auto leading-relaxed mb-5">
              Our sales team can design a package tailored to your volume,
              compliance requirements, and integration architecture. No commitment required.
            </p>
            <motion.button
              onClick={() => setPage('command')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#00FF41] text-[#050505] font-mono-data text-xs font-bold tracking-[0.15em] rounded transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.25)]"
            >
              INITIALIZE ONBOARDING
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mb-6"
        >
          <h2 className="font-mono-data text-sm tracking-[0.15em] text-[#C0C0C0]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <FaqSection />
        </motion.div>
      </div>
    </div>
  )
}
