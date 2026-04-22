'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Server,
  Route,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  GitBranch,
  Globe,
  Zap,
  ArrowRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAtlasStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { routeTransaction, getAllGatewayStatuses, aggregateVolumesByCurrency, type GatewayStatus, type RoutingDecision } from '@/lib/nexflowx'

// ─── Mock Data ───────────────────────────────────────────────────────────────

const chartData = [
  { day: 'Mon', eur: 142000, gbp: 38000, brl: 62000 },
  { day: 'Tue', eur: 189000, gbp: 42000, brl: 71000 },
  { day: 'Wed', eur: 156000, gbp: 35000, brl: 58000 },
  { day: 'Thu', eur: 210000, gbp: 51000, brl: 89000 },
  { day: 'Fri', eur: 178000, gbp: 47000, brl: 76000 },
  { day: 'Sat', eur: 95000, gbp: 22000, brl: 43000 },
  { day: 'Sun', eur: 78000, gbp: 18000, brl: 35000 },
]

const transactions = [
  { ref: 'TXN-7A2F9E01C4', merchant: 'TechVault SARL', amount: '€12,450.00', gateway: 'Stripe France', status: 'completed', time: '2m ago', region: 'EU' },
  { ref: 'TXN-3B8D4F02A7', merchant: 'NexusPay Ltd', amount: '£8,320.50', gateway: 'Stripe UK', status: 'completed', time: '5m ago', region: 'UK' },
  { ref: 'TXN-1C6E7G03B8', merchant: 'CryptoBridge GmbH', amount: '€23,100.00', gateway: 'Adyen', status: 'processing', time: '8m ago', region: 'EU' },
  { ref: 'TXN-9D5A8H04C9', merchant: 'FinFlow SAS', amount: '€3,890.25', gateway: 'Stripe France', status: 'completed', time: '12m ago', region: 'EU' },
  { ref: 'TXN-4E2B9I05D1', merchant: 'PayMerge Ltd', amount: '£15,670.80', gateway: 'Stripe UK', status: 'pending', time: '15m ago', region: 'UK' },
  { ref: 'TXN-6F3C1J06E2', merchant: 'Atlas Brazil Hub', amount: 'R$45,200.00', gateway: 'Stripe Brazil', status: 'completed', time: '18m ago', region: 'BR' },
  { ref: 'TXN-8G4D2K07F3', merchant: 'CryptoBridge GmbH', amount: '€42,100.00', gateway: 'Cripto', status: 'failed', time: '22m ago', region: 'EU' },
  { ref: 'TXN-2H5E3L08G4', merchant: 'StarkBank Corp', amount: 'R$12,890.30', gateway: 'Stark Bank', status: 'completed', time: '28m ago', region: 'BR' },
  { ref: 'TXN-5I6F4M09H5', merchant: 'PayMerge Ltd', amount: '£18,500.00', gateway: 'Stripe UK', status: 'processing', time: '35m ago', region: 'UK' },
  { ref: 'TXN-7J7G5N10I6', merchant: 'FinFlow SAS', amount: '€6,330.75', gateway: 'Adyen', status: 'completed', time: '42m ago', region: 'EU' },
]

const merchants = [
  { name: 'TechVault SARL', volume: '€456K', retention: 89, txCount: 342 },
  { name: 'NexusPay Ltd', volume: '£312K', retention: 94, txCount: 567 },
  { name: 'CryptoBridge GmbH', volume: '€198K', retention: 76, txCount: 231 },
]

// ─── Nav Items ───────────────────────────────────────────────────────────────

const navItems = [
  { label: 'DASHBOARD', icon: LayoutDashboard },
  { label: 'TRANSACTIONS', icon: ArrowLeftRight },
  { label: 'CUSTOMERS', icon: Users },
  { label: 'GATEWAYS', icon: Server },
  { label: 'ROUTING', icon: Route },
] as const

type NavItem = (typeof navItems)[number]['label']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/10'
    case 'pending':
      return 'text-[#FFB800] border-[#FFB800]/30 bg-[#FFB800]/10'
    case 'processing':
      return 'text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/10'
    case 'failed':
      return 'text-[#FF0040] border-[#FF0040]/30 bg-[#FF0040]/10'
    default:
      return 'text-[#C0C0C0] border-white/10 bg-white/5'
  }
}

function gatewayBadge(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/10'
    case 'DEGRADED':
      return 'text-[#FFB800] border-[#FFB800]/30 bg-[#FFB800]/10'
    case 'INACTIVE':
    default:
      return 'text-[#FF0040] border-[#FF0040]/30 bg-[#FF0040]/10'
  }
}

function regionBadgeColor(region: string) {
  switch (region) {
    case 'EU':
      return 'text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/5'
    case 'UK':
      return 'text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/5'
    case 'BR':
      return 'text-[#00FF41] border-[#00FF41]/30 bg-[#00FF41]/5'
    default:
      return 'text-[#C0C0C0] border-white/10 bg-white/5'
  }
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="panel-light px-3 py-2 border border-[#00FF41]/20">
      <p className="font-mono-data text-xs text-[#C0C0C0]">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="font-mono-data text-sm" style={{ color: entry.dataKey === 'eur' ? '#00FF41' : entry.dataKey === 'gbp' ? '#A78BFA' : '#00F0FF' }}>
          {entry.dataKey?.toUpperCase()}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ─── KYB Gate ────────────────────────────────────────────────────────────────

function KybGate() {
  const { setKybCompleted } = useAtlasStore()
  const { toast } = useToast()

  const [form, setForm] = useState({
    email: '',
    companyName: '',
    registrationNumber: '',
    directorName: '',
    directorId: '',
    country: 'FR',
    taxId: '',
    jurisdiction: 'FR' as string,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const handleCountryChange = (country: string) => {
    setForm((prev) => ({ ...prev, country }))
    setError('')

    // Auto-set jurisdiction based on country
    let jurisdiction = 'FR'
    if (['FR', 'DE', 'ES', 'IT'].includes(country)) {
      jurisdiction = 'FR'
    } else if (country === 'UK') {
      jurisdiction = 'UK'
    } else if (country === 'PT') {
      jurisdiction = 'PT'
    } else if (country === 'BR') {
      jurisdiction = 'BR'
    } else if (country === 'US') {
      jurisdiction = 'US'
    }
    setForm((prev) => ({ ...prev, country, jurisdiction }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/kyb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed')
        return
      }

      setKybCompleted(true)
      toast({
        title: 'KYB VERIFIED',
        description: 'Business verification complete. Access granted.',
      })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'bg-[#111111] border-[rgba(255,255,255,0.08)] text-[#C0C0C0] font-mono-data text-sm h-10 rounded-md focus-visible:border-[#00FF41]/50 focus-visible:ring-[#00FF41]/20 placeholder:text-[#6B7280]'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg panel glow-border-green p-8 relative"
      >
        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline rounded-lg pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full border border-[#00FF41]/30 bg-[#00FF41]/5 flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-[#00FF41]" />
          </div>
          <h1 className="font-mono-data text-lg tracking-[0.2em] text-[#C0C0C0]">
            KNOW YOUR BUSINESS
          </h1>
          <p className="text-xs text-[#6B7280] mt-2 text-center max-w-sm">
            Mandatory compliance verification before accessing Atlas Command
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
              Business Email
            </Label>
            <Input
              type="email"
              placeholder="ops@company.com"
              className={inputClass}
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
              Company Legal Name
            </Label>
            <Input
              placeholder="Company SARL"
              className={inputClass}
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
                Registration Number
              </Label>
              <Input
                placeholder="RCS-123456"
                className={inputClass}
                value={form.registrationNumber}
                onChange={(e) => update('registrationNumber', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
                Tax ID (SIRET / Company # / CNPJ)
              </Label>
              <Input
                placeholder="123 456 789 00010"
                className={inputClass}
                value={form.taxId}
                onChange={(e) => update('taxId', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
                Country
              </Label>
              <Select value={form.country} onValueChange={handleCountryChange}>
                <SelectTrigger className={`${inputClass} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[rgba(255,255,255,0.08)]">
                  <SelectItem value="FR" className="text-[#C0C0C0] font-mono-data text-xs">FR</SelectItem>
                  <SelectItem value="UK" className="text-[#C0C0C0] font-mono-data text-xs">UK</SelectItem>
                  <SelectItem value="PT" className="text-[#C0C0C0] font-mono-data text-xs">PT</SelectItem>
                  <SelectItem value="BR" className="text-[#C0C0C0] font-mono-data text-xs">BR</SelectItem>
                  <SelectItem value="DE" className="text-[#C0C0C0] font-mono-data text-xs">DE</SelectItem>
                  <SelectItem value="US" className="text-[#C0C0C0] font-mono-data text-xs">US</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
                Jurisdiction
              </Label>
              <Select value={form.jurisdiction} onValueChange={(val) => update('jurisdiction', val)}>
                <SelectTrigger className={`${inputClass} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[rgba(255,255,255,0.08)]">
                  <SelectItem value="FR" className="text-[#C0C0C0] font-mono-data text-xs">FR (EU)</SelectItem>
                  <SelectItem value="UK" className="text-[#C0C0C0] font-mono-data text-xs">UK</SelectItem>
                  <SelectItem value="PT" className="text-[#C0C0C0] font-mono-data text-xs">PT (EU)</SelectItem>
                  <SelectItem value="BR" className="text-[#C0C0C0] font-mono-data text-xs">BR</SelectItem>
                  <SelectItem value="DE" className="text-[#C0C0C0] font-mono-data text-xs">DE (EU)</SelectItem>
                  <SelectItem value="US" className="text-[#C0C0C0] font-mono-data text-xs">US</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
                Director Name
              </Label>
              <Input
                placeholder="Jean Dupont"
                className={inputClass}
                value={form.directorName}
                onChange={(e) => update('directorName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono-data text-xs text-[#6B7280] tracking-wider uppercase">
              Director ID Number
            </Label>
            <Input
              placeholder="ID-1234567890"
              className={inputClass}
              value={form.directorId}
              onChange={(e) => update('directorId', e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono-data text-[#FF0040] bg-[#FF0040]/5 border border-[#FF0040]/20 rounded px-3 py-2"
            >
              ERR:: {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#00FF41] text-[#050505] font-mono-data text-xs tracking-[0.15em] hover:bg-[#00FF41]/90 rounded-md"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                VERIFYING...
              </span>
            ) : (
              'SUBMIT KYB VERIFICATION'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="terminal-text opacity-60">KYB_DATA::ENCRYPTED::AES-256</p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Routing Visualization ──────────────────────────────────────────────────

function RoutingVisualization() {
  const routingNodes = [
    {
      id: 'root',
      label: 'NeXFlowX Engine',
      sublabel: 'v2.1 — Decision Tree',
      icon: GitBranch,
      color: '#00FF41',
    },
    {
      id: 'br',
      label: 'region === "BR"',
      sublabel: 'Brazil / LATAM',
      icon: Globe,
      color: '#00FF41',
      children: ['stripe_br', 'stark_bank'],
    },
    {
      id: 'stripe_br',
      label: 'Stripe Brazil',
      sublabel: 'Credit / Boleto / PIX',
      icon: Zap,
      color: '#00F0FF',
      parentId: 'br',
    },
    {
      id: 'stark_bank',
      label: 'Stark Bank',
      sublabel: 'PIX / Boleto / Transfer',
      icon: Zap,
      color: '#00F0FF',
      parentId: 'br',
    },
    {
      id: 'eu',
      label: 'region === "EU"',
      sublabel: 'France / Germany / etc.',
      icon: Globe,
      color: '#A78BFA',
      children: ['stripe_fr', 'adyen_eu'],
    },
    {
      id: 'stripe_fr',
      label: 'Stripe France',
      sublabel: 'EI 2013 — SEPA / Card',
      icon: Zap,
      color: '#00F0FF',
      parentId: 'eu',
    },
    {
      id: 'adyen_eu',
      label: 'Adyen',
      sublabel: 'SEPA / iDEAL / Sofort',
      icon: Zap,
      color: '#00F0FF',
      parentId: 'eu',
    },
    {
      id: 'fallback',
      label: 'ELSE',
      sublabel: 'UK / US / Default',
      icon: Globe,
      color: '#FFB800',
      children: ['iahub360'],
    },
    {
      id: 'iahub360',
      label: 'IAHUB360 LTD',
      sublabel: '#16568194 — BACS / FPS',
      icon: Zap,
      color: '#00F0FF',
      parentId: 'fallback',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Engine Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="panel glow-border-green p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg border border-[#00FF41]/30 bg-[#00FF41]/5 flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-[#00FF41]" />
          </div>
          <div>
            <h2 className="font-mono-data text-sm tracking-[0.15em] text-[#C0C0C0]">
              NeXFlowX <span className="text-[#00FF41]">ROUTING ENGINE</span>
            </h2>
            <p className="font-mono-data text-xs text-[#6B7280] mt-1">
              v2.1 — Multi-Region Intelligent Payment Routing Decision Tree
            </p>
          </div>
          <Badge
            variant="outline"
            className="font-mono-data text-[10px] text-[#00FF41] border-[#00FF41]/30 ml-auto"
          >
            LIVE
          </Badge>
        </div>

        {/* Decision Tree Visualization */}
        <div className="space-y-4">
          {/* Root Node */}
          <div className="flex flex-col items-center gap-1">
            <div className="panel-light px-5 py-3 border border-[#00FF41]/30 flex items-center gap-3">
              <GitBranch className="w-4 h-4 text-[#00FF41]" />
              <div>
                <p className="font-mono-data text-sm text-[#00FF41] font-semibold">routeTransaction(payload)</p>
                <p className="font-mono-data text-[10px] text-[#6B7280]">Entry Point — Detect Region → Select Gateway</p>
              </div>
            </div>
            <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]" />
          </div>

          {/* Branch Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* BR Branch */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="panel-light p-4 border border-[#00FF41]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span className="font-mono-data text-xs text-[#00FF41] tracking-wider">BR — BRAZIL</span>
                </div>
                <p className="font-mono-data text-[11px] text-[#6B7280] mb-3">
                  IF region === &apos;BR&apos; → PIX / Boleto
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] rounded-md border border-[rgba(255,255,255,0.05)]">
                    <ArrowRight className="w-3 h-3 text-[#00F0FF]" />
                    <span className="font-mono-data text-xs text-[#C0C0C0]">Stripe Brazil</span>
                    <Badge variant="outline" className="font-mono-data text-[9px] text-[#00F0FF] border-[#00F0FF]/30 ml-auto">PRIMARY</Badge>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] rounded-md border border-[rgba(255,255,255,0.05)]">
                    <ArrowRight className="w-3 h-3 text-[#FFB800]" />
                    <span className="font-mono-data text-xs text-[#C0C0C0]">Stark Bank</span>
                    <Badge variant="outline" className="font-mono-data text-[9px] text-[#FFB800] border-[#FFB800]/30 ml-auto">FALLBACK</Badge>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-[10px] text-[#6B7280]">Currency</span>
                    <span className="font-mono-data text-[10px] text-[#00FF41]">BRL (R$)</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono-data text-[10px] text-[#6B7280]">Latency</span>
                    <span className="font-mono-data text-[10px] text-[#C0C0C0]">18–45ms</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* EU Branch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3"
            >
              <div className="panel-light p-4 border border-[#A78BFA]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span className="font-mono-data text-xs text-[#A78BFA] tracking-wider">EU — EUROPE</span>
                </div>
                <p className="font-mono-data text-[11px] text-[#6B7280] mb-3">
                  IF region === &apos;EU&apos; → SEPA / Card
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] rounded-md border border-[rgba(255,255,255,0.05)]">
                    <ArrowRight className="w-3 h-3 text-[#00F0FF]" />
                    <span className="font-mono-data text-xs text-[#C0C0C0]">Stripe France</span>
                    <Badge variant="outline" className="font-mono-data text-[9px] text-[#00F0FF] border-[#00F0FF]/30 ml-auto">PRIMARY</Badge>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] rounded-md border border-[rgba(255,255,255,0.05)]">
                    <ArrowRight className="w-3 h-3 text-[#FFB800]" />
                    <span className="font-mono-data text-xs text-[#C0C0C0]">Adyen</span>
                    <Badge variant="outline" className="font-mono-data text-[9px] text-[#FFB800] border-[#FFB800]/30 ml-auto">FALLBACK</Badge>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-[10px] text-[#6B7280]">Currency</span>
                    <span className="font-mono-data text-[10px] text-[#A78BFA]">EUR (€)</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono-data text-[10px] text-[#6B7280]">Entity</span>
                    <span className="font-mono-data text-[10px] text-[#C0C0C0]">EI 2013</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* UK / Default Branch */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-3"
            >
              <div className="panel-light p-4 border border-[#FFB800]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span className="font-mono-data text-xs text-[#FFB800] tracking-wider">ELSE — UK / DEFAULT</span>
                </div>
                <p className="font-mono-data text-[11px] text-[#6B7280] mb-3">
                  ELSE → BACS / Faster Payments
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] rounded-md border border-[rgba(255,255,255,0.05)]">
                    <ArrowRight className="w-3 h-3 text-[#00F0FF]" />
                    <span className="font-mono-data text-xs text-[#C0C0C0]">IAHUB360 LTD</span>
                    <Badge variant="outline" className="font-mono-data text-[9px] text-[#00F0FF] border-[#00F0FF]/30 ml-auto">PRIMARY</Badge>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#111111] rounded-md border border-[rgba(255,255,255,0.05)]">
                    <ArrowRight className="w-3 h-3 text-[#FFB800]" />
                    <span className="font-mono-data text-xs text-[#C0C0C0]">Adyen UK</span>
                    <Badge variant="outline" className="font-mono-data text-[9px] text-[#FFB800] border-[#FFB800]/30 ml-auto">FALLBACK</Badge>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-[10px] text-[#6B7280]">Currency</span>
                    <span className="font-mono-data text-[10px] text-[#FFB800]">GBP (£)</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono-data text-[10px] text-[#6B7280]">Entity</span>
                    <span className="font-mono-data text-[10px] text-[#C0C0C0]">#16568194</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Routing Rules Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 panel-light p-4"
        >
          <h3 className="font-mono-data text-xs tracking-[0.15em] text-[#6B7280] mb-3">
            ROUTING RULES // SUMMARY
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono-data text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-[#00FF41]">→</span>
              <span className="text-[#C0C0C0]">IF region === &apos;BR&apos; → <span className="text-[#00F0FF]">Stripe Brazil</span> / <span className="text-[#00F0FF]">Stark Bank</span> (PIX)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#A78BFA]">→</span>
              <span className="text-[#C0C0C0]">IF region === &apos;EU&apos; → <span className="text-[#00F0FF]">Stripe France</span> (EI 2013) / <span className="text-[#00F0FF]">Adyen</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFB800]">→</span>
              <span className="text-[#C0C0C0]">ELSE → <span className="text-[#00F0FF]">IAHUB360 LTD</span> (UK) / <span className="text-[#00F0FF]">Adyen UK</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#6B7280]">→</span>
              <span className="text-[#C0C0C0]">Fallback: <span className="text-[#FFB800]">auto-retry on gateway failure</span></span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>('DASHBOARD')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [now, setNow] = useState<Date | null>(null)

  // NeXFlowX gateway data
  const gatewayStatuses = useMemo(() => getAllGatewayStatuses(), [])

  // Multi-currency volume data
  const currencyVolumes = useMemo(() => [
    { currency: 'EUR', total: 1048203, symbol: '€', formatted: '€1,048,203', color: '#A78BFA' },
    { currency: 'GBP', total: 424913, symbol: '£', formatted: '£424,913', color: '#00F0FF' },
    { currency: 'BRL', total: 581090, symbol: 'R$', formatted: 'R$581,090', color: '#00FF41' },
  ], [])

  const activeGatewayCount = gatewayStatuses.filter(g => g.status === 'ACTIVE').length

  useEffect(() => {
    // Interval starts immediately, updating state in callback (not synchronously)
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'}
          lg:relative lg:translate-x-0
          -translate-x-full lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-[#0A0A0A] border-r border-[rgba(255,255,255,0.06)] flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00FF41]/10 border border-[#00FF41]/20 flex items-center justify-center">
              <span className="font-mono-data text-xs font-bold text-[#00FF41]">A</span>
            </div>
            <div>
              <h2 className="font-mono-data text-sm font-semibold tracking-[0.15em] text-[#C0C0C0]">
                ATLAS
              </h2>
              <p className="font-mono-data text-[10px] text-[#6B7280] tracking-wider">
                COMMAND
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeNav === item.label
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-mono-data tracking-wider
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-[#1A1A1A] text-[#00FF41] border-l-2 border-[#00FF41]'
                    : 'text-[#6B7280] hover:bg-[#1A1A1A] hover:text-[#C0C0C0] border-l-2 border-transparent'
                  }
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Version */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <Badge
            variant="outline"
            className="font-mono-data text-[10px] text-[#6B7280] border-[rgba(255,255,255,0.08)]"
          >
            v2.1.0
          </Badge>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 rounded-md bg-[#0A0A0A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#C0C0C0]"
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-4 lg:p-6 space-y-6">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div className="pl-12 lg:pl-0">
            <h1 className="font-mono-data text-sm md:text-base tracking-[0.15em] text-[#C0C0C0]">
              {'ATLAS COMMAND '}<span className="text-[#6B7280]">{'//'}</span>{' '}
              <span className="text-[#00FF41]">{activeNav}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono-data text-xs text-[#6B7280]">
              {now ? `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : '--'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B7280] hover:text-[#00FF41] hover:bg-[#00FF41]/5"
              onClick={() => setNow(new Date())}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* ── DASHBOARD VIEW ──────────────────────────────────────────── */}
        {activeNav === 'DASHBOARD' && (
          <>
            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                {
                  label: 'TOTAL VOLUME',
                  value: '€1.24M',
                  change: '+12.4%',
                  positive: true,
                  color: '#00FF41',
                  sub: 'EUR €1.05M · GBP £425K · BRL R$581K',
                },
                {
                  label: 'ACTIVE GATEWAYS',
                  value: `${activeGatewayCount}/${gatewayStatuses.length}`,
                  change: `${gatewayStatuses.length - activeGatewayCount} OFFLINE`,
                  positive: activeGatewayCount === gatewayStatuses.length,
                  color: '#00F0FF',
                },
                {
                  label: 'PENDING KYB',
                  value: '2',
                  change: 'NEW TODAY',
                  positive: false,
                  color: '#FFB800',
                },
                {
                  label: 'SUCCESS RATE',
                  value: '99.2%',
                  change: '+0.3%',
                  positive: true,
                  color: '#00FF41',
                },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="panel p-4"
                >
                  <p className="font-mono-data text-[10px] tracking-[0.15em] text-[#6B7280] mb-2">
                    {metric.label}
                  </p>
                  <p className="font-mono-data text-xl lg:text-2xl font-bold" style={{ color: metric.color }}>
                    {metric.value}
                  </p>
                  {metric.sub && (
                    <p className="font-mono-data text-[9px] text-[#6B7280] mt-1 truncate">
                      {metric.sub}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    {metric.positive ? (
                      <TrendingUp className="w-3 h-3 text-[#00FF41]" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-[#FFB800]" />
                    )}
                    <span
                      className={`font-mono-data text-[10px] ${
                        metric.positive ? 'text-[#00FF41]' : 'text-[#FFB800]'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Volume By Currency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#6B7280] mb-3">
                VOLUME BY CURRENCY
              </h2>
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                {currencyVolumes.map((cv, i) => (
                  <motion.div
                    key={cv.currency}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                    className="panel p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono-data text-[10px] tracking-[0.15em] text-[#6B7280]">
                        {cv.currency}
                      </p>
                      <Circle className="w-2 h-2 fill-current" style={{ color: cv.color }} />
                    </div>
                    <p className="font-mono-data text-lg lg:text-xl font-bold" style={{ color: cv.color }}>
                      {cv.formatted}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <TrendingUp className="w-3 h-3 text-[#00FF41]" />
                      <span className="font-mono-data text-[10px] text-[#00FF41]">
                        +8.2%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Chart + Gateway Status Row */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
              {/* Transaction Volume Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="panel p-5 xl:col-span-3"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0]">
                    TRANSACTION VOLUME // 7D
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current text-[#A78BFA]" />
                      <span className="font-mono-data text-[9px] text-[#6B7280]">EUR</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current text-[#00F0FF]" />
                      <span className="font-mono-data text-[9px] text-[#6B7280]">GBP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current text-[#00FF41]" />
                      <span className="font-mono-data text-[9px] text-[#6B7280]">BRL</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-mono-data text-[10px] text-[#00FF41] border-[#00FF41]/30"
                    >
                      LIVE
                    </Badge>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <defs>
                        <linearGradient id="eurGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="gbpGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#00F0FF" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="brlGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00FF41" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#00FF41" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                        width={50}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="eur"
                        stroke="#A78BFA"
                        strokeWidth={2}
                        fill="url(#eurGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#A78BFA', stroke: '#050505', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="brl"
                        stroke="#00FF41"
                        strokeWidth={2}
                        fill="url(#brlGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#00FF41', stroke: '#050505', strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="gbp"
                        stroke="#00F0FF"
                        strokeWidth={2}
                        fill="url(#gbpGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#00F0FF', stroke: '#050505', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Gateway Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="panel p-5 xl:col-span-2"
              >
                <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0] mb-4">
                  PAYMENT GATEWAY STATUS
                </h2>
                <ScrollArea className="max-h-80">
                  <div className="space-y-2">
                    {gatewayStatuses.map((gw) => (
                      <div
                        key={gw.name}
                        className="panel-light px-3 py-2.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Circle
                            className={`w-2 h-2 shrink-0 fill-current ${
                              gw.status === 'ACTIVE' ? 'text-[#00FF41]' : gw.status === 'DEGRADED' ? 'text-[#FFB800]' : 'text-[#FF0040]'
                            }`}
                          />
                          <div className="min-w-0">
                            <span className="font-mono-data text-xs text-[#C0C0C0] truncate block">
                              {gw.name}
                            </span>
                            <span className="font-mono-data text-[9px] text-[#6B7280]">
                              {gw.region} · {gw.currency}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono-data text-[10px] text-[#6B7280]">
                            {gw.latency}
                          </span>
                          <span className="font-mono-data text-[10px] text-[#C0C0C0] w-14 text-right">
                            {gw.volume}
                          </span>
                          <Badge
                            variant="outline"
                            className={`font-mono-data text-[9px] px-1.5 py-0 ${gatewayBadge(gw.status)}`}
                          >
                            {gw.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </div>

            {/* Transactions Log + CRM Row */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
              {/* Transaction Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="panel p-5 xl:col-span-3"
              >
                <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0] mb-4">
                  TRANSACTION LOG // LAST 10
                </h2>
                <ScrollArea className="max-h-96">
                  <div className="space-y-1.5">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-mono-data text-[#6B7280] tracking-wider uppercase">
                      <span className="col-span-3">REF</span>
                      <span className="col-span-2 hidden sm:block">MERCHANT</span>
                      <span className="col-span-2 text-right">AMOUNT</span>
                      <span className="col-span-2 hidden md:block text-center">GATEWAY</span>
                      <span className="col-span-1 hidden lg:block text-center">REGION</span>
                      <span className="col-span-2 text-right">STATUS</span>
                    </div>
                    {/* Rows */}
                    {transactions.map((tx) => (
                      <div
                        key={tx.ref}
                        className="grid grid-cols-12 gap-2 px-3 py-2.5 panel-light items-center hover:bg-[#222222] transition-colors"
                      >
                        <span className="font-mono-data text-[11px] text-[#C0C0C0] truncate col-span-3">
                          {tx.ref}
                        </span>
                        <span className="font-mono-data text-[11px] text-[#6B7280] truncate col-span-2 hidden sm:block">
                          {tx.merchant}
                        </span>
                        <span className="font-mono-data text-[11px] text-[#00FF41] text-right col-span-2">
                          {tx.amount}
                        </span>
                        <span className="col-span-2 hidden md:flex justify-center">
                          <Badge
                            variant="outline"
                            className="font-mono-data text-[9px] px-1.5 py-0 text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/5"
                          >
                            {tx.gateway}
                          </Badge>
                        </span>
                        <span className="col-span-1 hidden lg:flex justify-center">
                          <Badge
                            variant="outline"
                            className={`font-mono-data text-[9px] px-1.5 py-0 ${regionBadgeColor(tx.region)}`}
                          >
                            {tx.region}
                          </Badge>
                        </span>
                        <span className="col-span-2 flex justify-end">
                          <Badge
                            variant="outline"
                            className={`font-mono-data text-[9px] px-1.5 py-0 capitalize ${statusColor(tx.status)}`}
                          >
                            {tx.status}
                          </Badge>
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>

              {/* CRM Quick View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="panel p-5 xl:col-span-2"
              >
                <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0] mb-4">
                  CRM // TOP MERCHANTS
                </h2>
                <div className="space-y-3">
                  {merchants.map((m) => (
                    <div key={m.name} className="panel-light p-4">
                      <h3 className="font-mono-data text-sm text-[#00F0FF] mb-3 truncate">
                        {m.name}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="font-mono-data text-[10px] text-[#6B7280] uppercase tracking-wider">
                            Volume
                          </p>
                          <p className="font-mono-data text-xs text-[#C0C0C0] mt-1">{m.volume}</p>
                        </div>
                        <div>
                          <p className="font-mono-data text-[10px] text-[#6B7280] uppercase tracking-wider">
                            Retention
                          </p>
                          <p className="font-mono-data text-xs mt-1">
                            <span
                              className={
                                m.retention >= 90
                                  ? 'text-[#00FF41]'
                                  : m.retention >= 80
                                    ? 'text-[#FFB800]'
                                    : 'text-[#FF0040]'
                              }
                            >
                              {m.retention}%
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="font-mono-data text-[10px] text-[#6B7280] uppercase tracking-wider">
                            TXNs
                          </p>
                          <p className="font-mono-data text-xs text-[#C0C0C0] mt-1">
                            {m.txCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* ── TRANSACTIONS VIEW ─────────────────────────────────────── */}
        {activeNav === 'TRANSACTIONS' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="panel p-5"
          >
            <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0] mb-4">
              ALL TRANSACTIONS // MULTI-REGION
            </h2>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-mono-data text-[#6B7280] tracking-wider uppercase">
                  <span className="col-span-3">REF</span>
                  <span className="col-span-2">MERCHANT</span>
                  <span className="col-span-2 text-right">AMOUNT</span>
                  <span className="col-span-2 text-center">GATEWAY</span>
                  <span className="col-span-1 text-center">REGION</span>
                  <span className="col-span-2 text-right">STATUS</span>
                </div>
                {transactions.map((tx) => (
                  <div
                    key={tx.ref}
                    className="grid grid-cols-12 gap-2 px-3 py-2.5 panel-light items-center hover:bg-[#222222] transition-colors"
                  >
                    <span className="font-mono-data text-[11px] text-[#C0C0C0] truncate col-span-3">
                      {tx.ref}
                    </span>
                    <span className="font-mono-data text-[11px] text-[#6B7280] truncate col-span-2">
                      {tx.merchant}
                    </span>
                    <span className="font-mono-data text-[11px] text-[#00FF41] text-right col-span-2">
                      {tx.amount}
                    </span>
                    <span className="col-span-2 flex justify-center">
                      <Badge
                        variant="outline"
                        className="font-mono-data text-[9px] px-1.5 py-0 text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/5"
                      >
                        {tx.gateway}
                      </Badge>
                    </span>
                    <span className="col-span-1 flex justify-center">
                      <Badge
                        variant="outline"
                        className={`font-mono-data text-[9px] px-1.5 py-0 ${regionBadgeColor(tx.region)}`}
                      >
                        {tx.region}
                      </Badge>
                    </span>
                    <span className="col-span-2 flex justify-end">
                      <Badge
                        variant="outline"
                        className={`font-mono-data text-[9px] px-1.5 py-0 capitalize ${statusColor(tx.status)}`}
                      >
                        {tx.status}
                      </Badge>
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {/* ── CUSTOMERS VIEW ────────────────────────────────────────── */}
        {activeNav === 'CUSTOMERS' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="panel p-5"
          >
            <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0] mb-4">
              CRM // ALL MERCHANTS
            </h2>
            <div className="space-y-3">
              {merchants.map((m) => (
                <div key={m.name} className="panel-light p-4">
                  <h3 className="font-mono-data text-sm text-[#00F0FF] mb-3 truncate">
                    {m.name}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="font-mono-data text-[10px] text-[#6B7280] uppercase tracking-wider">
                        Volume
                      </p>
                      <p className="font-mono-data text-xs text-[#C0C0C0] mt-1">{m.volume}</p>
                    </div>
                    <div>
                      <p className="font-mono-data text-[10px] text-[#6B7280] uppercase tracking-wider">
                        Retention
                      </p>
                      <p className="font-mono-data text-xs mt-1">
                        <span
                          className={
                            m.retention >= 90
                              ? 'text-[#00FF41]'
                              : m.retention >= 80
                                ? 'text-[#FFB800]'
                                : 'text-[#FF0040]'
                          }
                        >
                          {m.retention}%
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-mono-data text-[10px] text-[#6B7280] uppercase tracking-wider">
                        TXNs
                      </p>
                      <p className="font-mono-data text-xs text-[#C0C0C0] mt-1">
                        {m.txCount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── GATEWAYS VIEW ────────────────────────────────────────── */}
        {activeNav === 'GATEWAYS' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="panel p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono-data text-xs tracking-[0.15em] text-[#C0C0C0]">
                ALL GATEWAYS // NeXFlowX REGISTRY
              </h2>
              <Badge
                variant="outline"
                className="font-mono-data text-[10px] text-[#00F0FF] border-[#00F0FF]/30"
              >
                {activeGatewayCount}/{gatewayStatuses.length} ONLINE
              </Badge>
            </div>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-2">
                {gatewayStatuses.map((gw) => (
                  <div
                    key={gw.name}
                    className="panel-light px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Circle
                        className={`w-3 h-3 shrink-0 fill-current ${
                          gw.status === 'ACTIVE' ? 'text-[#00FF41]' : gw.status === 'DEGRADED' ? 'text-[#FFB800]' : 'text-[#FF0040]'
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="font-mono-data text-sm text-[#C0C0C0] truncate block">
                          {gw.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="outline"
                            className={`font-mono-data text-[9px] px-1.5 py-0 ${regionBadgeColor(gw.region)}`}
                          >
                            {gw.region}
                          </Badge>
                          <span className="font-mono-data text-[10px] text-[#6B7280]">{gw.currency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="font-mono-data text-xs text-[#C0C0C0]">{gw.volume}</p>
                        <p className="font-mono-data text-[10px] text-[#6B7280]">{gw.latency}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`font-mono-data text-[10px] px-2 py-0.5 ${gatewayBadge(gw.status)}`}
                      >
                        {gw.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {/* ── ROUTING VIEW ─────────────────────────────────────────── */}
        {activeNav === 'ROUTING' && (
          <RoutingVisualization />
        )}
      </main>
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function CommandHub() {
  const { kybCompleted } = useAtlasStore()

  return (
    <AnimatePresence mode="wait">
      {!kybCompleted ? (
        <motion.div
          key="kyb-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <KybGate />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
