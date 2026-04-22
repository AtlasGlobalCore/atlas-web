'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  Globe,
  MapPin,
  Scale,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Lock,
  Eye,
  Clock,
  Users,
  Mail,
  ChevronDown,
  CheckCircle2,
  Database,
  ClipboardCheck,
  FileCheck,
  MapPinned,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAtlasStore, type LegalTab } from '@/lib/store'

// ─── Tab Definitions ──────────────────────────────────────────────────────────

const tabs: { id: LegalTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'structure', label: 'STRUCTURE', icon: Building2 },
  { id: 'terms-of-service', label: 'TERMS OF SERVICE', icon: FileText },
  { id: 'privacy-policy', label: 'PRIVACY POLICY', icon: Lock },
  { id: 'compliance-manifesto', label: 'COMPLIANCE MANIFESTO', icon: Scale },
  { id: 'refund-policy', label: 'REFUND POLICY', icon: ClipboardCheck },
]

type TabId = LegalTab

// ─── Jurisdiction Mapping ─────────────────────────────────────────────────────

const jurisdictionOptions = [
  { value: '', label: 'AUTO-DETECT (All Regions)' },
  { value: 'FR', label: '🇫🇷  France / EU' },
  { value: 'UK', label: '🇬🇧  United Kingdom' },
  { value: 'PT', label: '🇵🇹  Portugal' },
  { value: 'BR', label: '🇧🇷  Brazil' },
] as const

const entityJurisdictionMap: Record<string, number> = {
  FR: 0,
  UK: 1,
  PT: 2,
  BR: 3,
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// ─── Tab 1: Legal Structure ──────────────────────────────────────────────────

const entities = [
  {
    badge: 'TECHNOLOGY & INFRASTRUCTURE PROVIDER',
    badgeColor: '#00FF41' as const,
    name: 'Sergio Monteiro (EI) – France',
    icon: Server,
    borderColor: 'border-l-[#00FF41]',
    badgeBg: 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30',
    details: [
      { label: 'Registration', value: 'SIREN 790 155 006 (Established 2013)', mono: true },
      { label: 'Activity Code', value: 'APE 62.03Z (Gestion d\'installations informatiques)', mono: false },
      { label: 'Role', value: 'IP Holder, Core Technology & Hosting Management', mono: false },
    ],
  },
  {
    badge: 'GLOBAL COMMERCIAL OPERATIONS',
    badgeColor: '#00F0FF' as const,
    name: 'IAHUB360 LTD – United Kingdom',
    icon: Globe,
    borderColor: 'border-l-[#00F0FF]',
    badgeBg: 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30',
    details: [
      { label: 'Company Number', value: '16568194', mono: true },
      { label: 'Role', value: 'B2B Billing, International Licensing & Orchestration', mono: false },
    ],
  },
  {
    badge: 'REGIONAL SUPPORT & IMPLEMENTATION',
    badgeColor: '#FFB800' as const,
    name: 'Sergio Monteiro (ENI) – Portugal',
    icon: MapPin,
    borderColor: 'border-l-[#FFB800]',
    badgeBg: 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30',
    details: [
      { label: 'NIF', value: 'PT219458090', mono: true },
      { label: 'Role', value: 'Regional Logistics & Iberian Payment Integration', mono: false },
    ],
  },
  {
    badge: 'BRAZIL HUB',
    badgeColor: '#FF0040' as const,
    name: 'Atlas Global Core — Brazil Hub',
    icon: Globe,
    borderColor: 'border-l-[#FF0040]',
    badgeBg: 'bg-[#FF0040]/10 text-[#FF0040] border-[#FF0040]/30',
    details: [
      { label: 'CNPJ', value: '59.326.683/0001-14', mono: true },
      { label: 'Capital Social', value: 'R$ 200.000,00', mono: true },
      { label: 'Role', value: 'LATAM Operations, PIX & Local Payment Processing', mono: false },
    ],
  },
]

function StructureTab() {
  const [detectedJurisdiction, setDetectedJurisdiction] = useState('')
  const highlightedEntityIndex = detectedJurisdiction ? entityJurisdictionMap[detectedJurisdiction] : undefined

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Section Title */}
      <motion.div variants={fadeUp} custom={0}>
        <h2 className="font-mono-data text-lg md:text-xl tracking-[0.15em] text-[#C0C0C0] mb-2">
          LEGAL STRUCTURE &amp; ENTITIES
        </h2>
        <p className="text-sm text-[#C0C0C0]/60 leading-relaxed max-w-3xl">
          Atlas Global Core operates through a multi-entity corporate structure designed to meet Tier-1 acquirer compliance requirements across multiple jurisdictions.
        </p>
      </motion.div>

      {/* Jurisdiction Selector */}
      <motion.div variants={fadeUp} custom={0.05}>
        <div className="panel-light p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <MapPinned className="w-4 h-4 text-[#00F0FF]" />
            <span className="font-mono-data text-[10px] tracking-[0.15em] text-[#C0C0C0]/70 uppercase">
              Jurisdiction
            </span>
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[280px]">
            <select
              value={detectedJurisdiction}
              onChange={(e) => setDetectedJurisdiction(e.target.value)}
              className="w-full appearance-none bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded px-3 py-2 pr-8 text-sm text-[#C0C0C0] font-mono-data tracking-wide focus:outline-none focus:border-[#00F0FF]/40 transition-colors cursor-pointer"
            >
              {jurisdictionOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-[#C0C0C0]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          {detectedJurisdiction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 text-[10px] font-mono-data tracking-wider text-[#00FF41]/80"
            >
              <CheckCircle2 className="w-3 h-3" />
              REGION DETECTED — {detectedJurisdiction}
            </motion.div>
          )}
        </div>
      </motion.div>

      <Separator className="bg-[rgba(255,255,255,0.06)]" />

      {/* Entity Cards */}
      <div className="space-y-4">
        {entities.map((entity, index) => {
          const isHighlighted = highlightedEntityIndex === index
          return (
            <motion.div
              key={entity.name}
              variants={fadeUp}
              custom={0.1 + index * 0.1}
              className={`panel border-l-2 ${entity.borderColor} p-5 md:p-6 transition-all duration-300 ${
                isHighlighted
                  ? 'ring-1 ring-[#00F0FF]/30 shadow-[0_0_30px_rgba(0,240,255,0.08)]'
                  : ''
              }`}
            >
              {/* Badge + Icon Row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: `${entity.badgeColor}10`,
                      border: `1px solid ${entity.badgeColor}25`,
                    }}
                  >
                    <entity.icon className="w-4 h-4" style={{ color: entity.badgeColor }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`font-mono-data text-[9px] tracking-[0.15em] mb-1 ${entity.badgeBg}`}
                      >
                        {entity.badge}
                      </Badge>
                      {isHighlighted && (
                        <motion.div
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <Badge className="font-mono-data text-[9px] tracking-[0.15em] bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 mb-1">
                            ★ YOUR REGION
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-[#C0C0C0] tracking-wide leading-snug">
                      {entity.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Details Table */}
              <div className="ml-12 space-y-0">
                {entity.details.map((detail, i) => (
                  <div
                    key={detail.label}
                    className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-2 ${
                      i < entity.details.length - 1
                        ? 'border-b border-[rgba(255,255,255,0.04)]'
                        : ''
                    }`}
                  >
                    <span className="font-mono-data text-[10px] tracking-[0.15em] text-[#6B7280] uppercase shrink-0 sm:w-36">
                      {detail.label}
                    </span>
                    <span
                      className={`text-sm text-[#C0C0C0]/80 leading-relaxed ${
                        detail.mono ? 'font-mono-data text-xs' : ''
                      }`}
                    >
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Regulatory Notice */}
      <motion.div
        variants={fadeUp}
        custom={0.45}
        className="relative panel-light p-5 md:p-6 overflow-hidden"
      >
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFB800]" />

        <div className="flex items-start gap-3 ml-2">
          <AlertTriangle className="w-5 h-5 text-[#FFB800] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-mono-data text-xs tracking-[0.15em] text-[#FFB800] mb-2">
              REGULATORY NOTICE
            </h4>
            <p className="text-sm text-[#C0C0C0]/70 leading-relaxed">
              Atlas Global Core operates as a Technical Service Provider (TSP). We do not hold, process, or transmit payment card data directly. All financial transactions are conducted through licensed and regulated financial institutions. Atlas provides technology infrastructure, routing intelligence, and CRM capabilities.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Tab 2: Terms of Service ──────────────────────────────────────────────────

const termsSections = [
  {
    number: '1',
    title: 'ACCEPTANCE OF TERMS',
    content: `By accessing or using the Atlas Global Core platform ("the Platform"), you ("Merchant," "you," or "your") acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and IAHUB360 LTD, acting as the commercial entity for Atlas Global Core. If you do not agree to these Terms, you must cease all use of the Platform immediately. Your continued use of the Platform following any updates to these Terms constitutes acceptance of the revised agreement.`,
  },
  {
    number: '2',
    title: 'SERVICE DESCRIPTION',
    content: `Atlas Global Core is a Technical Service Provider (TSP) that delivers a suite of B2B commerce infrastructure tools. The Platform provides intelligent payment routing and orchestration through the NeXFlowX Routing Engine, which directs transaction traffic across multiple licensed payment processors to optimize authorization rates, reduce latency, and ensure redundancy. Additionally, Atlas offers The Brain CRM, a merchant intelligence platform for customer segmentation, predictive analytics, and automated engagement workflows. The Platform also includes Atlas Studio, a storefront and landing page builder with automated compliance injection for regulated commerce environments. Atlas does not directly process, settle, or hold any payment card data or funds.`,
  },
  {
    number: '3',
    title: 'MERCHANT OBLIGATIONS',
    content: `As a condition of using the Platform, Merchants must complete and maintain accurate Know Your Business (KYB) documentation, including but not limited to valid business registration, proof of address, and identification of ultimate beneficial owners. Merchants are responsible for ensuring that all information provided to Atlas remains current and accurate. Merchants must comply with all applicable laws, regulations, and industry standards in each jurisdiction where they operate, including but not limited to PCI-DSS, PSD2, GDPR, and local anti-money laundering (AML) requirements. Failure to maintain compliance may result in suspension or termination of Platform access.`,
  },
  {
    number: '4',
    title: 'PAYMENT PROCESSING DISCLAIMER',
    content: `Atlas Global Core is not a bank, financial institution, or licensed payment processor. We do not hold merchant funds, settle transactions, or issue payment instruments. All payment processing, settlement, and fund disbursement is conducted exclusively through our licensed and regulated financial partners, including but not limited to Stripe, Adyen, Viva Wallet, and authorized cryptocurrency processors. Atlas acts solely as a technology intermediary, providing routing intelligence, infrastructure, and data orchestration services. Any reference to "payments," "transactions," or "processing" within the Platform refers to the technology layer that facilitates communication between Merchants and licensed payment processors. Merchants maintain direct contractual relationships with each payment processor they activate through the Platform. Atlas bears no liability for the processing, settlement, or security of funds handled by third-party payment institutions.`,
  },
  {
    number: '5',
    title: 'LIMITATION OF LIABILITY',
    content: `To the maximum extent permitted by applicable law, Atlas Global Core, its officers, directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from or related to the use or inability to use the Platform. Atlas's total cumulative liability for any claims arising under these Terms shall not exceed the total fees paid by the Merchant to Atlas during the twelve (12) months preceding the event giving rise to the claim. This limitation applies regardless of the legal theory under which the claim is made.`,
  },
  {
    number: '6',
    title: 'TERMINATION',
    content: `Either party may terminate this agreement upon thirty (30) days written notice to the other party. Atlas reserves the right to terminate or suspend access immediately and without prior notice in the event of a material breach, suspected fraudulent activity, regulatory action, or compliance violation. Upon termination, Merchants must cease all use of the Platform and remove any integrated Atlas technology from their systems. Sections relating to liability limitations, confidentiality, and governing law shall survive termination.`,
  },
]

function TermsTab() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} custom={0}>
        <h2 className="font-mono-data text-lg md:text-xl tracking-[0.15em] text-[#C0C0C0] mb-2">
          TERMS OF SERVICE — TECHNICAL SERVICE PROVIDER
        </h2>
        <p className="font-mono-data text-xs text-[#00F0FF]/70 tracking-wider">
          Effective Date: January 1, 2024
        </p>
      </motion.div>

      <Separator className="bg-[rgba(255,255,255,0.06)]" />

      <div className="space-y-8">
        {termsSections.map((section, index) => (
          <motion.div key={section.number} variants={fadeUp} custom={0.1 + index * 0.06}>
            <div className="flex items-start gap-3 mb-3">
              <span className="font-mono-data text-xs text-[#00FF41]/50 tracking-wider mt-0.5 shrink-0">
                §{section.number}
              </span>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase">
                {section.title}
              </h3>
            </div>
            <p className="text-sm text-[#C0C0C0]/60 leading-[1.8] ml-7">
              {section.content}
            </p>
            {index < termsSections.length - 1 && (
              <Separator className="mt-6 bg-[rgba(255,255,255,0.03)]" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Tab 3: Acceptable Use Policy ────────────────────────────────────────────

const aupSections = [
  {
    icon: AlertTriangle,
    title: 'PROHIBITED ACTIVITIES',
    content: `Merchants are strictly prohibited from using the Atlas Global Core Platform to facilitate, support, or engage in the following activities: fraud, identity theft, or any form of deceptive financial practices; money laundering, terrorist financing, or any transaction designed to obscure the origin or destination of funds; sale, distribution, or advertisement of illegal goods, services, or controlled substances; unauthorized collection, processing, storage, or sale of personal data in violation of applicable privacy laws; sale of counterfeit goods, pirated software, or any product that infringes upon intellectual property rights; and any form of phishing, malware distribution, or cyber-attacks directed at consumers or third parties. Violation of any prohibited activity constitutes an immediate material breach of these Terms.`,
  },
  {
    icon: Eye,
    title: 'TRANSACTION MONITORING',
    content: `Atlas Global Core reserves the right to implement, operate, and continuously refine automated transaction monitoring systems designed to detect suspicious activity, anomalous patterns, and potential compliance violations. These systems analyze transaction metadata including volume, frequency, velocity, geographic patterns, and merchant behavior indicators. When the monitoring system flags a transaction or account for review, Atlas may temporarily pause routing through the affected gateway(s) pending investigation. Merchants will be notified of any such action and provided with a reasonable opportunity to respond. Atlas cooperates fully with law enforcement, regulatory authorities, and licensed financial institutions in the investigation of suspected illicit activity.`,
  },
  {
    icon: Users,
    title: 'COMPLIANCE COOPERATION',
    content: `All Merchants using the Atlas Platform must actively cooperate with regulatory investigations, compliance audits, and due diligence requests initiated by Atlas, its licensed payment processing partners, or authorized government agencies. This includes providing timely and accurate documentation, responding to information requests within the specified timeframe, and maintaining records sufficient to demonstrate compliance with all applicable laws and regulations. Merchants must promptly notify Atlas of any regulatory action, legal proceeding, or investigation that may affect their ability to operate in compliance with these requirements. Failure to cooperate with compliance inquiries may result in immediate suspension of Platform access pending resolution.`,
  },
  {
    icon: ShieldCheck,
    title: 'ENFORCEMENT',
    content: `Violation of this Acceptable Use Policy will result in enforcement actions proportional to the severity and nature of the violation. For moderate or first-time violations, Atlas may issue a formal warning, require remediation within a specified period, or impose temporary feature restrictions. For severe violations, including fraud, money laundering, or the sale of illegal goods, Atlas will immediately suspend or permanently terminate the Merchant's access to the Platform, revoke all API credentials, and notify relevant payment processing partners and regulatory authorities. Atlas reserves the right to report violations to law enforcement agencies when required by law or when such reporting is necessary to protect the integrity of the Platform and its users. Merchants acknowledge that enforcement decisions are at Atlas's sole discretion.`,
  },
]

function AupTab() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} custom={0}>
        <h2 className="font-mono-data text-lg md:text-xl tracking-[0.15em] text-[#C0C0C0] mb-2">
          ACCEPTABLE USE POLICY
        </h2>
        <p className="text-sm text-[#C0C0C0]/60 leading-relaxed max-w-3xl">
          This Acceptable Use Policy ("AUP") governs the use of the Atlas Global Core Platform and applies to all Merchants, their employees, agents, and authorized users. By using the Platform, you agree to comply with all provisions of this AUP.
        </p>
      </motion.div>

      <Separator className="bg-[rgba(255,255,255,0.06)]" />

      <div className="space-y-6">
        {aupSections.map((section, index) => (
          <motion.div
            key={section.title}
            variants={fadeUp}
            custom={0.1 + index * 0.08}
            className="panel p-5 md:p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-[#FF0040]/10 border border-[#FF0040]/20">
                <section.icon className="w-4 h-4 text-[#FF0040]" />
              </div>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase">
                {section.title}
              </h3>
            </div>
            <p className="text-sm text-[#C0C0C0]/60 leading-[1.8]">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Tab 4: Privacy Policy ───────────────────────────────────────────────────

const privacySections = [
  {
    icon: Eye,
    title: 'DATA COLLECTION',
    content: `Atlas Global Core collects and processes the following categories of data to deliver and improve its Platform services: Business Information, including legal entity name, registration number, tax identification, business address, and authorized representative details provided during onboarding; Transaction Metadata, which includes routing data, gateway response codes, latency measurements, transaction timestamps, and volume statistics — importantly, Atlas does not collect, store, or have access to payment card numbers, CVV codes, or full authentication credentials; and Usage Analytics, encompassing Platform interaction patterns, feature utilization metrics, session data, and device information used for performance monitoring and service optimization. All data collection is conducted in accordance with applicable data protection regulations.`,
  },
  {
    icon: Lock,
    title: 'DATA PROCESSING & SECURITY',
    content: `All data processed by Atlas Global Core is protected by industry-leading encryption and security standards. Data in transit is secured using Transport Layer Security (TLS 1.3) with perfect forward secrecy for all API communications and dashboard sessions. Data at rest is encrypted using AES-256-GCM encryption across all storage systems, databases, and backup infrastructure. Access to production data is restricted through a zero-trust architecture with multi-factor authentication, role-based access controls, and comprehensive audit logging. Atlas conducts regular penetration testing, security audits, and vulnerability assessments performed by independent third-party security firms. The Platform infrastructure is deployed across SOC 2 Type II certified data centers in the European Union.`,
  },
  {
    icon: Clock,
    title: 'DATA RETENTION',
    content: `Atlas Global Core retains data for the minimum periods necessary to fulfill operational, legal, and regulatory obligations. Business registration and KYB documentation is retained for the duration of the commercial relationship and for a period of seven (7) years following termination, as required by applicable financial regulations in the European Union and United Kingdom. Transaction metadata and routing logs are retained for a period of five (5) years to support dispute resolution, regulatory reporting, and audit compliance. Usage analytics and session data are retained for a maximum of twenty-four (24) months, after which it is aggregated and anonymized for long-term trend analysis. Upon expiration of the applicable retention period, data is securely deleted in accordance with our data destruction procedures.`,
  },
  {
    icon: Users,
    title: 'THIRD-PARTY SHARING',
    content: `Atlas Global Core does not sell, rent, or trade any data collected through the Platform. Data may be shared with the following categories of recipients strictly for legitimate operational purposes: Licensed Payment Processors — transaction routing data is shared with authorized payment gateway partners (e.g., Stripe, Adyen, Viva Wallet) solely for the purpose of facilitating payment processing on behalf of the Merchant; Regulatory Bodies — data may be disclosed to competent regulatory authorities, financial supervisory agencies, or law enforcement when required by applicable law, regulation, or legal process; and Service Providers — select technical service providers acting as data processors under binding Data Processing Agreements may access data to the extent necessary to provide infrastructure, security, or analytics services. All third-party data sharing is governed by appropriate contractual safeguards and conducted in compliance with GDPR, UK GDPR, and applicable data protection laws.`,
  },
  {
    icon: Scale,
    title: 'DATA SUBJECT RIGHTS',
    content: `In compliance with the General Data Protection Regulation (GDPR) and the UK General Data Protection Regulation (UK GDPR), Atlas Global Core recognizes and supports the following data subject rights: Right of Access — individuals may request confirmation of whether their data is being processed and obtain a copy of such data; Right to Rectification — individuals may request correction of inaccurate or incomplete personal data; Right to Erasure ("Right to be Forgotten") — individuals may request deletion of personal data when it is no longer necessary for the purposes for which it was collected, subject to legal retention obligations; Right to Restriction of Processing — individuals may request limitation of processing activities under specified circumstances; Right to Data Portability — individuals may request their data in a structured, commonly used, and machine-readable format; and Right to Object — individuals may object to processing based on legitimate interests or processing for direct marketing purposes. Requests should be submitted to the Data Protection Officer at the contact address below and will be responded to within thirty (30) days.`,
  },
  {
    icon: Mail,
    title: 'CONTACT',
    content: `For all inquiries related to data protection, privacy, or the exercise of data subject rights, please contact our Data Protection Officer:`,
    contact: 'legal@atlasglobalcore.com',
  },
]

function PrivacyTab() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} custom={0}>
        <h2 className="font-mono-data text-lg md:text-xl tracking-[0.15em] text-[#C0C0C0] mb-2">
          PRIVACY POLICY
        </h2>
        <p className="font-mono-data text-xs text-[#00F0FF]/70 tracking-wider mb-3">
          Effective Date: January 1, 2024 &nbsp;|&nbsp; Last Updated: January 1, 2024
        </p>
        <p className="text-sm text-[#C0C0C0]/60 leading-relaxed max-w-3xl">
          Atlas Global Core ("Atlas," "we," "us," or "our") is committed to protecting the privacy and security of data processed through its Platform. This Privacy Policy describes how we collect, process, retain, and share data in compliance with GDPR, UK GDPR, and applicable data protection legislation.
        </p>
      </motion.div>

      <Separator className="bg-[rgba(255,255,255,0.06)]" />

      <div className="space-y-6">
        {privacySections.map((section, index) => (
          <motion.div
            key={section.title}
            variants={fadeUp}
            custom={0.1 + index * 0.07}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded flex items-center justify-center bg-[#00F0FF]/8 border border-[#00F0FF]/15">
                <section.icon className="w-3.5 h-3.5 text-[#00F0FF]" />
              </div>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase">
                {section.title}
              </h3>
            </div>
            <p className="text-sm text-[#C0C0C0]/60 leading-[1.8] ml-10">
              {section.content}
            </p>
            {section.contact && (
              <div className="ml-10 mt-3 panel-light inline-flex items-center gap-2 px-4 py-2.5">
                <Mail className="w-4 h-4 text-[#00FF41]" />
                <span className="font-mono-data text-sm text-[#00FF41]">
                  {section.contact}
                </span>
              </div>
            )}
            {index < privacySections.length - 1 && (
              <Separator className="mt-6 bg-[rgba(255,255,255,0.03)]" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Tab 5: Compliance Manifesto ──────────────────────────────────────────────

const regulatoryFramework = [
  { name: 'PSD2', full: 'EU Payment Services Directive', status: 'ACTIVE' },
  { name: 'PCI-DSS', full: 'PCI-DSS Level 1 Certification', status: 'CERTIFIED' },
  { name: 'GDPR', full: 'General Data Protection Regulation (EU)', status: 'COMPLIANT' },
  { name: 'UK GDPR', full: 'UK General Data Protection Regulation', status: 'COMPLIANT' },
  { name: 'LGPD', full: 'Lei Geral de Proteção de Dados (Brazil)', status: 'COMPLIANT' },
  { name: 'AML5/6', full: '6th Anti-Money Laundering Directive', status: 'COMPLIANT' },
]

const jurisdictionTable = [
  {
    region: 'FR / EU',
    flag: '🇫🇷',
    entity: 'Sergio Monteiro (EI)',
    identifier: 'SIREN 790 155 006',
    color: '#00FF41',
  },
  {
    region: 'UK',
    flag: '🇬🇧',
    entity: 'IAHUB360 LTD',
    identifier: 'Companies House #16568194',
    color: '#00F0FF',
  },
  {
    region: 'PT',
    flag: '🇵🇹',
    entity: 'Sergio Monteiro (ENI)',
    identifier: 'PT219458090',
    color: '#FFB800',
  },
  {
    region: 'BR',
    flag: '🇧🇷',
    entity: 'Atlas Global Core — Brazil Hub',
    identifier: 'CNPJ 59.326.683/0001-14 — Capital R$200K',
    color: '#FF0040',
  },
]

function ComplianceManifestoTab() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp} custom={0}>
        <h2 className="font-mono-data text-lg md:text-xl tracking-[0.15em] text-[#C0C0C0] mb-2">
          ATLAS GLOBAL CORE — COMPLIANCE MANIFESTO
        </h2>
        <p className="font-mono-data text-xs text-[#00F0FF]/70 tracking-wider mb-3">
          Technical Service Provider (TSP) Declaration
        </p>
        <p className="text-sm text-[#C0C0C0]/60 leading-relaxed max-w-3xl">
          This manifesto declares the regulatory posture, compliance commitments, and jurisdictional operating boundaries of Atlas Global Core as a multi-entity Technical Service Provider operating across four jurisdictions.
        </p>
      </motion.div>

      <Separator className="bg-[rgba(255,255,255,0.06)]" />

      {/* Section A: TSP Declaration */}
      <motion.div variants={fadeUp} custom={0.1}>
        <div className="relative panel p-5 md:p-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF41]" />
          <div className="flex items-start gap-3 ml-2">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#00FF41]/10 border border-[#00FF41]/20 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#00FF41]" />
            </div>
            <div>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase mb-1">
                A — TSP DECLARATION
              </h3>
              <p className="text-sm text-[#C0C0C0]/60 leading-[1.8]">
                Atlas Global Core operates <span className="text-[#00FF41] font-semibold">exclusively</span> as a Technology Service Provider (TSP). Atlas does not directly process payments, does not hold merchant funds in custody, does not issue payment instruments, and does not store, transmit, or have access to payment card primary account numbers (PANs), CVV/CVC codes, or full authentication credentials. All financial transactions routed through the Atlas Platform are processed, settled, and custodied by licensed and regulated financial institutions with which merchants maintain direct contractual relationships. Atlas provides technology infrastructure, intelligent routing, data orchestration, and CRM capabilities only.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section B: Regulatory Framework */}
      <motion.div variants={fadeUp} custom={0.18}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[#00F0FF]/10 border border-[#00F0FF]/20">
            <Scale className="w-4 h-4 text-[#00F0FF]" />
          </div>
          <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase">
            B — REGULATORY FRAMEWORK
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regulatoryFramework.map((reg, i) => (
            <motion.div
              key={reg.name}
              variants={fadeUp}
              custom={0.2 + i * 0.04}
              className="panel p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-sm text-[#C0C0C0] font-semibold tracking-wider">
                  {reg.name}
                </span>
                <Badge
                  variant="outline"
                  className="font-mono-data text-[8px] tracking-[0.12em] bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30"
                >
                  {reg.status}
                </Badge>
              </div>
              <span className="text-xs text-[#6B7280] leading-relaxed">{reg.full}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section C: Entity Jurisdiction Map */}
      <motion.div variants={fadeUp} custom={0.35}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-[#FFB800]/10 border border-[#FFB800]/20">
            <MapPinned className="w-4 h-4 text-[#FFB800]" />
          </div>
          <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase">
            C — ENTITY JURISDICTION MAP
          </h3>
        </div>
        <div className="panel overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] border-b border-[rgba(255,255,255,0.06)] px-4 py-3 bg-[rgba(255,255,255,0.02)]">
            <span className="font-mono-data text-[10px] tracking-[0.15em] text-[#6B7280] uppercase">Region</span>
            <span className="font-mono-data text-[10px] tracking-[0.15em] text-[#6B7280] uppercase">Entity</span>
            <span className="font-mono-data text-[10px] tracking-[0.15em] text-[#6B7280] uppercase hidden sm:block">Identifier</span>
          </div>
          {/* Table Rows */}
          {jurisdictionTable.map((row, i) => (
            <div
              key={row.region}
              className={`grid grid-cols-[100px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] items-center px-4 py-3 ${
                i < jurisdictionTable.length - 1 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''
              }`}
            >
              <span className="text-sm flex items-center gap-2">
                <span>{row.flag}</span>
                <span className="font-mono-data text-xs text-[#C0C0C0] tracking-wider">{row.region}</span>
              </span>
              <span className="text-sm text-[#C0C0C0]/80" style={{ color: `${row.color}cc` }}>
                {row.entity}
              </span>
              <span className="text-xs text-[#6B7280] font-mono-data tracking-wider hidden sm:block">
                {row.identifier}
              </span>
            </div>
          ))}
          {/* Mobile fallback for identifier */}
          <div className="sm:hidden px-4 py-1">
            <p className="font-mono-data text-[9px] text-[#6B7280]/60 tracking-wider">
              Identifiers visible on desktop
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section D: Data Sovereignty */}
      <motion.div variants={fadeUp} custom={0.42}>
        <div className="relative panel p-5 md:p-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F0FF]" />
          <div className="flex items-start gap-3 ml-2">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#00F0FF]/10 border border-[#00F0FF]/20 shrink-0 mt-0.5">
              <Database className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase mb-2">
                D — DATA SOVEREIGNTY
              </h3>
              <p className="text-sm text-[#C0C0C0]/60 leading-[1.8] mb-3">
                Atlas Global Core maintains strict data residency controls aligned with regional regulatory requirements:
              </p>
              <ul className="space-y-2 text-sm text-[#C0C0C0]/60 leading-[1.8]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#00FF41] shrink-0 mt-2" />
                  <span><span className="text-[#C0C0C0]/80 font-medium">EU Data:</span> Processed and stored within European Union data centers. Subject to GDPR data transfer mechanisms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#00F0FF] shrink-0 mt-2" />
                  <span><span className="text-[#C0C0C0]/80 font-medium">UK Data:</span> Processed and stored within United Kingdom infrastructure. UK GDPR adequacy decision recognized.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FFB800] shrink-0 mt-2" />
                  <span><span className="text-[#C0C0C0]/80 font-medium">PT Data:</span> Stored within EU/EEA infrastructure. Portuguese DPA authority recognized per LGPD mutual cooperation framework.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FF0040] shrink-0 mt-2" />
                  <span><span className="text-[#C0C0C0]/80 font-medium">BR Data:</span> Processed in compliance with LGPD. Data residency within Brazil maintained where operationally required; cross-border transfers governed by LGPD Article 33 adequacy mechanisms.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section E: Audit Trail */}
      <motion.div variants={fadeUp} custom={0.5}>
        <div className="relative panel p-5 md:p-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFB800]" />
          <div className="flex items-start gap-3 ml-2">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#FFB800]/10 border border-[#FFB800]/20 shrink-0 mt-0.5">
              <ClipboardCheck className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase mb-2">
                E — AUDIT TRAIL &amp; CERTIFICATIONS
              </h3>
              <p className="text-sm text-[#C0C0C0]/60 leading-[1.8] mb-4">
                Atlas Global Core maintains comprehensive audit trails and pursues internationally recognized security certifications to demonstrate operational excellence and regulatory compliance:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="panel-light p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="font-mono-data text-[9px] tracking-[0.12em] bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/30"
                    >
                      CERTIFIED
                    </Badge>
                    <span className="font-mono-data text-sm text-[#C0C0C0] tracking-wider font-semibold">
                      SOC 2 Type II
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Annual third-party audit verifying controls for security, availability, processing integrity, confidentiality, and privacy across all Atlas infrastructure components.
                  </p>
                </div>
                <div className="panel-light p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="font-mono-data text-[9px] tracking-[0.12em] bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30"
                    >
                      CERTIFIED
                    </Badge>
                    <span className="font-mono-data text-sm text-[#C0C0C0] tracking-wider font-semibold">
                      ISO 27001
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Information Security Management System (ISMS) certification ensuring systematic and continuous improvement of security practices across the organization.
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#6B7280]/60 mt-4 leading-relaxed">
                All audit reports and certificates are available upon request to verified merchants, partners, and regulatory authorities under NDA. Contact: <span className="text-[#00FF41] font-mono-data">compliance@atlasglobalcore.com</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Tab 6: Refund Policy ──────────────────────────────────────────────────

const refundSections = [
  {
    icon: FileCheck,
    title: 'REFUND ELIGIBILITY',
    content: `Refund requests may be submitted by Merchants for Platform subscription fees, setup fees, and integration service charges under the following conditions: (a) the refund request is submitted within fourteen (14) calendar days of the original charge; (b) the service has not been substantially utilized or delivered; (c) the Merchant is in good standing with all terms and conditions of the service agreement; and (d) the refund does not relate to fees already consumed through transaction processing, gateway usage, or API calls. Refunds for transaction processing fees charged by third-party payment processors (Stripe, Adyen, Viva Wallet, Stark Bank, etc.) are subject to the respective processor's own refund and chargeback policies, which are independent of Atlas Global Core's refund policy.`,
  },
  {
    icon: Clock,
    title: 'REFUND PROCESSING TIME',
    content: `Upon approval of a valid refund request, Atlas Global Core will process the refund within ten (10) business days. The actual time for funds to appear in the Merchant's account may vary depending on the payment method and financial institution involved, typically ranging from five (5) to fifteen (15) additional business days. Atlas will provide the Merchant with a confirmation notification once the refund has been initiated, including a reference number for tracking purposes. Partial refunds may be issued at Atlas's discretion when the service has been partially utilized.`,
  },
  {
    icon: AlertTriangle,
    title: 'NON-REFUNDABLE ITEMS',
    content: `The following items are explicitly non-refundable: (a) fees related to transaction processing, gateway usage, and API calls that have already been consumed; (b) custom development, integration, or consulting services that have been completed; (c) subscription fees for periods beyond the current billing cycle if cancellation is received after the renewal date; (d) penalties, fines, or charges resulting from compliance violations or AUP breaches; (e) fees associated with chargebacks or dispute resolution processes initiated by end customers through licensed payment processors. Atlas reserves the right to deduct any outstanding balances or owed amounts from approved refund amounts before disbursement.`,
  },
  {
    icon: Mail,
    title: 'HOW TO REQUEST A REFUND',
    content: `To initiate a refund request, Merchants must submit a formal request through one of the following channels: Email: support@atlasglobal.digital — include the Merchant ID, invoice reference, and reason for the refund request. All refund requests are reviewed on a case-by-case basis. Atlas will acknowledge receipt of the request within two (2) business days and provide a resolution within ten (10) business days. Disputes regarding refund decisions may be escalated to compliance@atlasglobalcore.com for final review.`,
  },
]

function RefundPolicyTab() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} custom={0}>
        <h2 className="font-mono-data text-lg md:text-xl tracking-[0.15em] text-[#C0C0C0] mb-2">
          REFUND POLICY
        </h2>
        <p className="font-mono-data text-xs text-[#00F0FF]/70 tracking-wider">
          Effective Date: January 1, 2024 &nbsp;|&nbsp; Last Updated: January 1, 2024
        </p>
      </motion.div>

      <Separator className="bg-[rgba(255,255,255,0.06)]" />

      <div className="space-y-6">
        {refundSections.map((section, index) => (
          <motion.div key={section.title} variants={fadeUp} custom={0.1 + index * 0.07}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded flex items-center justify-center bg-[#FFB800]/8 border border-[#FFB800]/15">
                <section.icon className="w-3.5 h-3.5 text-[#FFB800]" />
              </div>
              <h3 className="font-mono-data text-xs md:text-sm tracking-[0.1em] text-[#C0C0C0] uppercase">
                {section.title}
              </h3>
            </div>
            <p className="text-sm text-[#C0C0C0]/60 leading-[1.8] ml-10">
              {section.content}
            </p>
            {index < refundSections.length - 1 && (
              <Separator className="mt-6 bg-[rgba(255,255,255,0.03)]" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Tab Content Router ───────────────────────────────────────────────────────

const tabContent: Record<TabId, React.FC> = {
  structure: StructureTab,
  'terms-of-service': TermsTab,
  'privacy-policy': PrivacyTab,
  'compliance-manifesto': ComplianceManifestoTab,
  'refund-policy': RefundPolicyTab,
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function LegalHub() {
  const { selectedLegalTab, setSelectedLegalTab } = useAtlasStore()

  const activeTab = tabContent[selectedLegalTab] ? selectedLegalTab : 'structure'
  const ActiveContent = tabContent[activeTab]

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Header */}
      <div className="pt-20 pb-2 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-1"
          >
            <h1 className="font-mono-data text-sm md:text-base tracking-[0.15em] text-[#00F0FF] glow-blue">
              ATLAS GLOBAL CORE <span className="text-[#C0C0C0]/40">{'//'}</span> LEGAL &amp; COMPLIANCE
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-[#C0C0C0]/50 max-w-3xl leading-relaxed"
          >
            Multi-entity corporate structure, regulatory compliance documentation, and Terms of Service for the Atlas platform.
          </motion.p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-14 z-30 bg-obsidian/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedLegalTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-3 text-[10px] md:text-xs font-mono-data tracking-[0.12em]
                    transition-colors whitespace-nowrap shrink-0 cursor-pointer
                    ${isActive ? 'text-[#00FF41]' : 'text-[#C0C0C0]/50 hover:text-[#C0C0C0]/80'}
                  `}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="legal-tab-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#00FF41]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 md:px-6 pb-16">
        <div className="max-w-5xl mx-auto pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveContent />
            </motion.div>
          </AnimatePresence>

          {/* Footer Timestamp */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 pt-6 border-t border-[rgba(255,255,255,0.04)]"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="font-mono-data text-[10px] text-[#6B7280] tracking-wider">
                DOCUMENT_CLASS::LEGAL&nbsp;&nbsp;|&nbsp;&nbsp;CLEARANCE::PUBLIC&nbsp;&nbsp;|&nbsp;&nbsp;VERSION::2.0
              </p>
              <p className="font-mono-data text-[10px] text-[#6B7280] tracking-wider">
                © {new Date().getFullYear()} Atlas Global Core™ — Operated by Sergio Monteiro (EI) in cooperation with IAHUB360 LTD
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
