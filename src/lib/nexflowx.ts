// ═══════════════════════════════════════════════════════════════
// NeXFlowX v3.0 — Intelligent Payment Routing Engine
// 3-Level Waterfall: Specific → Conditional → Tier
// Tier System: Bronze / Silver / Gold
// Providers: Stripe, Viva Wallet, Mistic, Adyen, Stark Bank
// Ledger Reconciliation built-in
// ═══════════════════════════════════════════════════════════════

export type Region = 'BR' | 'EU' | 'UK' | 'US' | 'LATAM' | 'PT'
export type Currency = 'EUR' | 'GBP' | 'BRL' | 'USD'
export type TransactionStatus = 'completed' | 'pending' | 'processing' | 'failed' | 'refunded' | 'chargeback'
export type RoutingLevel = 'specific' | 'conditional' | 'tier'
export type MerchantTier = 'bronze' | 'silver' | 'gold'
export type LedgerType = 'payment' | 'refund' | 'fee' | 'payout' | 'chargeback'

// ─── Interfaces ────────────────────────────────────────────

export interface RoutingRule {
  id: string
  merchantId?: string
  priority: number
  level: RoutingLevel
  conditions?: {
    amountMin?: number
    amountMax?: number
    currency?: Currency[]
    paymentMethod?: string[]
    country?: string[]
  }
  gateway: string
  fallbackGateway: string
  enabled: boolean
  hitCount?: number
  successCount?: number
}

export interface RoutingDecision {
  gateway: string
  region: Region
  currency: Currency
  estimatedLatency: string
  entityId: string
  entityName: string
  fallbackGateway: string
  routingLevel: RoutingLevel
  ruleId?: string
  confidence: number
  timestamp: string
  merchantTier: MerchantTier
  fees: { feeRate: number; feeFixed: number; totalFee: number; netAmount: number }
}

export interface TransactionPayload {
  amount: number
  currency?: Currency
  region?: Region
  merchantCountry?: string
  merchantId?: string
  merchantTier?: MerchantTier
  paymentMethod?: string
  customerId?: string
  metadata?: Record<string, unknown>
}

export interface GatewayConfig {
  gateway: string
  provider: string
  currency: Currency
  latency: string
  priority: number
  methods: string[]
  entityId: string
  entityName: string
  feeRate: number
  feeFixed: number
  status: 'ACTIVE' | 'INACTIVE' | 'DEGRADED'
  minTier?: MerchantTier
}

export interface LedgerEntry {
  transactionId: string
  merchantId?: string
  type: LedgerType
  amount: number
  currency: Currency
  gateway: string
  gatewayRef?: string
  entityId?: string
  description?: string
  status: 'pending' | 'settled' | 'failed'
}

export interface ProviderAdapter {
  name: string
  processPayment(payload: TransactionPayload, gateway: GatewayConfig): Promise<ProviderResult>
  refund(transactionRef: string, amount?: number): Promise<ProviderResult>
  getBalance(): Promise<{ available: number; pending: number; currency: Currency }>
}

export interface ProviderResult {
  success: boolean
  transactionRef: string
  gatewayRef?: string
  status: TransactionStatus
  errorCode?: string
  errorMessage?: string
  metadata?: Record<string, unknown>
}

// ─── Legal Entity Registry ─────────────────────────────────

export const LEGAL_ENTITIES = {
  FR_EI: { id: 'FR_EI_2013', name: 'Sergio Monteiro (EI)', registration: 'SIREN 790 155 006', jurisdiction: 'FR', type: 'EI' },
  UK_LTD: { id: 'UK_LTD_16568194', name: 'IAHUB360 LTD', registration: '#16568194', jurisdiction: 'UK', type: 'LTD' },
  PT_ENI: { id: 'PT_ENI', name: 'Atlas Global Core — ENI', registration: 'NIF Pending', jurisdiction: 'PT', type: 'ENI' },
  BR_HUB: { id: 'BR_HUB', name: 'Atlas Brazil Hub', registration: 'CNPJ Pending', jurisdiction: 'BR', type: 'Hub' },
} as const

// ─── Tier Configuration ────────────────────────────────────

export const TIER_CONFIG: Record<MerchantTier, {
  label: string
  maxRules: number
  feeDiscount: number
  routingPriority: number
  features: string[]
  minVolume: number
  color: string
}> = {
  bronze: {
    label: 'Bronze',
    maxRules: 3,
    feeDiscount: 0,
    routingPriority: 3,
    features: ['Single gateway', 'Basic analytics', 'Email support', '100 tx/month'],
    minVolume: 0,
    color: '#CD7F32',
  },
  silver: {
    label: 'Silver',
    maxRules: 10,
    feeDiscount: 10,
    routingPriority: 2,
    features: ['Up to 3 gateways', 'Advanced analytics', 'Priority support', '5,000 tx/month', 'Custom routing'],
    minVolume: 50000,
    color: '#C0C0C0',
  },
  gold: {
    label: 'Gold',
    maxRules: 999,
    feeDiscount: 20,
    routingPriority: 1,
    features: ['All gateways', 'Full analytics suite', 'Dedicated support', 'Unlimited tx', 'Custom routing', 'Ledger API', 'White-label'],
    minVolume: 250000,
    color: '#FFD700',
  },
}

// ─── Gateway Registry ──────────────────────────────────────

const GATEWAY_REGISTRY: Record<Region, GatewayConfig[]> = {
  BR: [
    { gateway: 'Stripe Brazil', provider: 'stripe', currency: 'BRL', latency: '45ms', priority: 1, methods: ['credit_card', 'debit_card', 'boleto', 'pix'], entityId: LEGAL_ENTITIES.BR_HUB.id, entityName: `${LEGAL_ENTITIES.BR_HUB.name} — via Stripe`, feeRate: 2.99, feeFixed: 0.50, status: 'ACTIVE' },
    { gateway: 'Stark Bank', provider: 'stark', currency: 'BRL', latency: '18ms', priority: 2, methods: ['pix', 'boleto', 'transfer'], entityId: LEGAL_ENTITIES.BR_HUB.id, entityName: `${LEGAL_ENTITIES.BR_HUB.name} — via Stark Bank`, feeRate: 1.50, feeFixed: 0.30, status: 'ACTIVE' },
    { gateway: 'Mistic BR', provider: 'mistic', currency: 'BRL', latency: '32ms', priority: 3, methods: ['credit_card', 'pix', 'boleto'], entityId: LEGAL_ENTITIES.BR_HUB.id, entityName: `${LEGAL_ENTITIES.BR_HUB.name} — via Mistic`, feeRate: 3.20, feeFixed: 0.40, status: 'ACTIVE' },
  ],
  EU: [
    { gateway: 'Stripe France', provider: 'stripe', currency: 'EUR', latency: '23ms', priority: 1, methods: ['credit_card', 'sepa', 'bancontact', 'ideal', 'apple_pay', 'google_pay'], entityId: LEGAL_ENTITIES.FR_EI.id, entityName: `${LEGAL_ENTITIES.FR_EI.name} — SIREN ${LEGAL_ENTITIES.FR_EI.registration}`, feeRate: 1.50, feeFixed: 0.25, status: 'ACTIVE' },
    { gateway: 'Viva Wallet', provider: 'viva', currency: 'EUR', latency: '35ms', priority: 2, methods: ['credit_card', 'sepa', 'iri', 'apple_pay'], entityId: LEGAL_ENTITIES.FR_EI.id, entityName: `${LEGAL_ENTITIES.FR_EI.name} — via Viva Wallet`, feeRate: 1.80, feeFixed: 0.20, status: 'ACTIVE' },
    { gateway: 'Mistic EU', provider: 'mistic', currency: 'EUR', latency: '28ms', priority: 3, methods: ['credit_card', 'sepa', 'ideal', 'sofort', 'apple_pay'], entityId: LEGAL_ENTITIES.PT_ENI.id, entityName: `${LEGAL_ENTITIES.PT_ENI.name} — via Mistic`, feeRate: 1.65, feeFixed: 0.22, status: 'ACTIVE', minTier: 'silver' },
    { gateway: 'Adyen', provider: 'adyen', currency: 'EUR', latency: '31ms', priority: 4, methods: ['credit_card', 'sepa', 'ideal', 'sofort', 'bancontact', 'apple_pay', 'google_pay'], entityId: LEGAL_ENTITIES.FR_EI.id, entityName: `${LEGAL_ENTITIES.FR_EI.name} — via Adyen`, feeRate: 2.00, feeFixed: 0.30, status: 'ACTIVE' },
  ],
  UK: [
    { gateway: 'Stripe UK', provider: 'stripe', currency: 'GBP', latency: '28ms', priority: 1, methods: ['credit_card', 'debit_card', 'bacs', 'faster_payments', 'apple_pay'], entityId: LEGAL_ENTITIES.UK_LTD.id, entityName: `${LEGAL_ENTITIES.UK_LTD.name} — #${LEGAL_ENTITIES.UK_LTD.registration}`, feeRate: 1.40, feeFixed: 0.20, status: 'ACTIVE' },
    { gateway: 'Viva UK', provider: 'viva', currency: 'GBP', latency: '42ms', priority: 2, methods: ['credit_card', 'debit_card', 'bacs', 'open_banking'], entityId: LEGAL_ENTITIES.UK_LTD.id, entityName: `${LEGAL_ENTITIES.UK_LTD.name} — via Viva Wallet`, feeRate: 1.70, feeFixed: 0.25, status: 'ACTIVE', minTier: 'silver' },
    { gateway: 'Mistic UK', provider: 'mistic', currency: 'GBP', latency: '36ms', priority: 3, methods: ['credit_card', 'open_banking', 'faster_payments'], entityId: LEGAL_ENTITIES.UK_LTD.id, entityName: `${LEGAL_ENTITIES.UK_LTD.name} — via Mistic`, feeRate: 1.55, feeFixed: 0.22, status: 'ACTIVE', minTier: 'gold' },
  ],
  US: [
    { gateway: 'Stripe US', provider: 'stripe', currency: 'USD', latency: '38ms', priority: 1, methods: ['credit_card', 'ach', 'apple_pay', 'google_pay'], entityId: LEGAL_ENTITIES.UK_LTD.id, entityName: `${LEGAL_ENTITIES.UK_LTD.name} — via Stripe US`, feeRate: 2.90, feeFixed: 0.30, status: 'ACTIVE' },
    { gateway: 'Mistic US', provider: 'mistic', currency: 'USD', latency: '44ms', priority: 2, methods: ['credit_card', 'ach', 'apple_pay'], entityId: LEGAL_ENTITIES.UK_LTD.id, entityName: `${LEGAL_ENTITIES.UK_LTD.name} — via Mistic`, feeRate: 2.50, feeFixed: 0.25, status: 'ACTIVE', minTier: 'gold' },
  ],
  LATAM: [
    { gateway: 'Stripe Brazil', provider: 'stripe', currency: 'BRL', latency: '65ms', priority: 1, methods: ['credit_card', 'boleto', 'pix'], entityId: LEGAL_ENTITIES.BR_HUB.id, entityName: `${LEGAL_ENTITIES.BR_HUB.name} — via Stripe`, feeRate: 3.50, feeFixed: 0.60, status: 'ACTIVE' },
    { gateway: 'Mistic LATAM', provider: 'mistic', currency: 'BRL', latency: '58ms', priority: 2, methods: ['credit_card', 'pix'], entityId: LEGAL_ENTITIES.BR_HUB.id, entityName: `${LEGAL_ENTITIES.BR_HUB.name} — via Mistic`, feeRate: 3.80, feeFixed: 0.55, status: 'ACTIVE' },
  ],
  PT: [
    { gateway: 'Mistic PT', provider: 'mistic', currency: 'EUR', latency: '19ms', priority: 1, methods: ['credit_card', 'sepa', 'mbway', 'multibanco'], entityId: LEGAL_ENTITIES.PT_ENI.id, entityName: `${LEGAL_ENTITIES.PT_ENI.name} — via Mistic`, feeRate: 1.45, feeFixed: 0.20, status: 'ACTIVE' },
    { gateway: 'Stripe PT', provider: 'stripe', currency: 'EUR', latency: '25ms', priority: 2, methods: ['credit_card', 'sepa', 'mbway'], entityId: LEGAL_ENTITIES.PT_ENI.id, entityName: `${LEGAL_ENTITIES.PT_ENI.name} — via Stripe`, feeRate: 1.50, feeFixed: 0.25, status: 'ACTIVE' },
  ],
}

// ─── Region Detection ──────────────────────────────────────

const COUNTRY_TO_REGION: Record<string, Region> = {
  FR: 'EU', DE: 'EU', ES: 'EU', IT: 'EU', NL: 'EU', BE: 'EU',
  AT: 'EU', IE: 'EU', LU: 'EU', FI: 'EU',
  PT: 'PT', GB: 'UK', BR: 'BR',
  AR: 'LATAM', CL: 'LATAM', CO: 'LATAM', MX: 'LATAM', PE: 'LATAM',
  US: 'US', CA: 'US',
}

const CURRENCY_TO_REGION: Partial<Record<Currency, Region>> = {
  BRL: 'BR', GBP: 'UK', EUR: 'EU', USD: 'US',
}

export function detectRegion(countryCode?: string, currencyCode?: string): Region {
  if (countryCode && COUNTRY_TO_REGION[countryCode]) return COUNTRY_TO_REGION[countryCode]
  if (currencyCode && CURRENCY_TO_REGION[currencyCode as Currency]) return CURRENCY_TO_REGION[currencyCode as Currency]!
  return 'EU'
}

// ─── Level 1: Specific Routing (Merchant Rules) ────────────

function routeBySpecificRules(payload: TransactionPayload, rules: RoutingRule[], merchantTier: MerchantTier): RoutingDecision | null {
  const tierConfig = TIER_CONFIG[merchantTier]
  const merchantRules = rules
    .filter(r => r.enabled && r.level === 'specific' && r.merchantId === payload.merchantId)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, tierConfig.maxRules)

  for (const rule of merchantRules) {
    const cond = rule.conditions
    if (!cond) continue
    if (cond.amountMin && payload.amount < cond.amountMin) continue
    if (cond.amountMax && payload.amount > cond.amountMax) continue
    if (cond.currency?.length && payload.currency && !cond.currency.includes(payload.currency)) continue
    if (cond.paymentMethod?.length && payload.paymentMethod && !cond.paymentMethod.includes(payload.paymentMethod)) continue
    if (cond.country?.length && payload.merchantCountry && !cond.country.includes(payload.merchantCountry)) continue

    const gw = findGatewayConfig(rule.gateway)
    const fees = gw ? calculateFees(payload.amount, gw, merchantTier) : { feeRate: 0, feeFixed: 0, totalFee: 0, netAmount: payload.amount }
    const region = payload.region || 'EU'
    const currency = payload.currency || 'EUR'

    return {
      gateway: rule.gateway, region, currency,
      estimatedLatency: gw?.latency || 'computed',
      entityId: gw?.entityId || '',
      entityName: gw?.entityName || '',
      fallbackGateway: rule.fallbackGateway,
      routingLevel: 'specific',
      ruleId: rule.id,
      confidence: 1.0,
      timestamp: new Date().toISOString(),
      merchantTier,
      fees,
    }
  }
  return null
}

// ─── Level 2: Conditional Routing (Business Logic) ────────

function routeByConditional(payload: TransactionPayload, region: Region, merchantTier: MerchantTier): GatewayConfig | null {
  const tierConfig = TIER_CONFIG[merchantTier]
  let gateways = GATEWAY_REGISTRY[region]?.filter(g => g.status === 'ACTIVE') || []

  // Filter by tier access
  if (merchantTier === 'bronze') {
    gateways = gateways.filter(g => !g.minTier || g.minTier === 'bronze')
  } else if (merchantTier === 'silver') {
    gateways = gateways.filter(g => !g.minTier || g.minTier === 'bronze' || g.minTier === 'silver')
  }

  if (!gateways.length) return null

  // High-value: most reliable (SEPA/BACS/ACH capable)
  if (payload.amount > 10000) {
    const reliable = gateways.find(g => g.methods.includes('sepa') || g.methods.includes('bacs') || g.methods.includes('ach'))
    if (reliable) return reliable
  }

  // PIX → Stark Bank (lowest fee)
  if (payload.paymentMethod === 'pix' && region === 'BR') {
    const stark = gateways.find(g => g.provider === 'stark')
    if (stark) return stark
  }

  // SEPA → lowest cost
  if (payload.paymentMethod === 'sepa' && region === 'EU') {
    const sorted = [...gateways].sort((a, b) => a.feeRate - b.feeRate)
    return sorted[0]
  }

  // EUR → Viva (merchant tier >= silver)
  if (payload.currency === 'EUR' && merchantTier !== 'bronze') {
    const viva = gateways.find(g => g.provider === 'viva')
    if (viva) return viva
  }

  // BRL → Mistic (tier >= gold for lower fee)
  if (payload.currency === 'BRL' && merchantTier === 'gold') {
    const mistic = gateways.find(g => g.provider === 'mistic')
    if (mistic) return mistic
  }

  // Open Banking UK → Mistic
  if (payload.paymentMethod === 'open_banking' && region === 'UK') {
    const mistic = gateways.find(g => g.provider === 'mistic' && g.methods.includes('open_banking'))
    if (mistic) return mistic
  }

  // MBWay / Multibanco → Mistic PT
  if (payload.paymentMethod === 'mbway' || payload.paymentMethod === 'multibanco') {
    return gateways[0]
  }

  return null
}

// ─── Level 3: Tier Routing (Fallback) ──────────────────────

function routeByTier(region: Region, merchantTier: MerchantTier, paymentMethod?: string): GatewayConfig {
  let gateways = GATEWAY_REGISTRY[region]?.filter(g => g.status === 'ACTIVE') || []

  // Bronze: only first provider (Stripe)
  if (merchantTier === 'bronze') {
    gateways = gateways.filter(g => g.provider === 'stripe' || !g.minTier || g.minTier === 'bronze')
  }

  if (!gateways.length) return GATEWAY_REGISTRY.UK[0]

  if (paymentMethod) {
    const match = gateways.find(g => g.methods.includes(paymentMethod))
    if (match) return match
  }

  return [...gateways].sort((a, b) => a.priority !== b.priority ? a.priority - b.priority : parseInt(a.latency) - parseInt(b.latency))[0]
}

// ─── Main Routing Engine ───────────────────────────────────

export function routeTransaction(payload: TransactionPayload, rules: RoutingRule[] = []): RoutingDecision {
  const merchantTier = (payload.merchantTier || 'bronze') as MerchantTier
  const region = payload.region || detectRegion(payload.merchantCountry, payload.currency)
  const currency = payload.currency || (region === 'BR' || region === 'LATAM' ? 'BRL' : region === 'UK' ? 'GBP' : 'EUR')
  const enriched = { ...payload, region, currency }

  // Level 1: Specific Merchant Rules
  const specificResult = routeBySpecificRules(enriched, rules, merchantTier)
  if (specificResult) return specificResult

  // Level 2: Conditional Logic
  const conditionalGw = routeByConditional(enriched, region, merchantTier)
  if (conditionalGw) {
    const fallback = getFallbackGateway(region, conditionalGw.gateway, merchantTier)
    const fees = calculateFees(payload.amount, conditionalGw, merchantTier)
    return {
      gateway: conditionalGw.gateway, region, currency,
      estimatedLatency: conditionalGw.latency,
      entityId: conditionalGw.entityId,
      entityName: conditionalGw.entityName,
      fallbackGateway: fallback?.gateway || 'Stripe',
      routingLevel: 'conditional',
      confidence: 0.85,
      timestamp: new Date().toISOString(),
      merchantTier,
      fees,
    }
  }

  // Level 3: Tier-based Fallback
  const tierGw = routeByTier(region, merchantTier, payload.paymentMethod)
  const fallback = getFallbackGateway(region, tierGw.gateway, merchantTier)
  const fees = calculateFees(payload.amount, tierGw, merchantTier)

  return {
    gateway: tierGw.gateway, region, currency,
    estimatedLatency: tierGw.latency,
    entityId: tierGw.entityId,
    entityName: tierGw.entityName,
    fallbackGateway: fallback?.gateway || 'Adyen',
    routingLevel: 'tier',
    confidence: 0.6,
    timestamp: new Date().toISOString(),
    merchantTier,
    fees,
  }
}

// ─── Helpers ───────────────────────────────────────────────

export function findGatewayConfig(gatewayName: string): GatewayConfig | undefined {
  for (const region of Object.keys(GATEWAY_REGISTRY) as Region[]) {
    const found = GATEWAY_REGISTRY[region].find(g => g.gateway === gatewayName)
    if (found) return found
  }
  return undefined
}

function getFallbackGateway(region: Region, currentGateway: string, merchantTier: MerchantTier): GatewayConfig | undefined {
  return GATEWAY_REGISTRY[region]?.filter(g => g.status === 'ACTIVE' && g.gateway !== currentGateway)[0]
}

export function calculateFees(amount: number, gw: GatewayConfig, merchantTier: MerchantTier = 'bronze'): { feeRate: number; feeFixed: number; totalFee: number; netAmount: number } {
  const discount = TIER_CONFIG[merchantTier].feeDiscount / 100
  const discountedRate = gw.feeRate * (1 - discount)
  const feePercent = amount * (discountedRate / 100)
  const totalFee = feePercent + gw.feeFixed
  return {
    feeRate: Math.round(discountedRate * 100) / 100,
    feeFixed: gw.feeFixed,
    totalFee: Math.round(totalFee * 100) / 100,
    netAmount: Math.round((amount - totalFee) * 100) / 100,
  }
}

// ─── Provider Adapters (Simulation) ────────────────────────

class StripeAdapter implements ProviderAdapter {
  name = 'stripe'
  async processPayment(payload: TransactionPayload, gateway: GatewayConfig): Promise<ProviderResult> {
    return { success: true, transactionRef: `ch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, gatewayRef: `pi_${Date.now()}`, status: 'completed' }
  }
  async refund(transactionRef: string, amount?: number): Promise<ProviderResult> {
    return { success: true, transactionRef: `re_${Date.now()}`, status: 'refunded' }
  }
  async getBalance(): Promise<{ available: number; pending: number; currency: Currency }> {
    return { available: 245680.50, pending: 12340.00, currency: 'EUR' }
  }
}

class VivaAdapter implements ProviderAdapter {
  name = 'viva'
  async processPayment(payload: TransactionPayload, gateway: GatewayConfig): Promise<ProviderResult> {
    return { success: true, transactionRef: `viv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, status: 'completed' }
  }
  async refund(transactionRef: string, amount?: number): Promise<ProviderResult> {
    return { success: true, transactionRef: `viv_re_${Date.now()}`, status: 'refunded' }
  }
  async getBalance(): Promise<{ available: number; pending: number; currency: Currency }> {
    return { available: 98230.75, pending: 4500.00, currency: 'EUR' }
  }
}

class MisticAdapter implements ProviderAdapter {
  name = 'mistic'
  async processPayment(payload: TransactionPayload, gateway: GatewayConfig): Promise<ProviderResult> {
    return { success: true, transactionRef: `mst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, status: 'completed' }
  }
  async refund(transactionRef: string, amount?: number): Promise<ProviderResult> {
    return { success: true, transactionRef: `mst_re_${Date.now()}`, status: 'refunded' }
  }
  async getBalance(): Promise<{ available: number; pending: number; currency: Currency }> {
    return { available: 67890.25, pending: 2100.00, currency: 'EUR' }
  }
}

class AdyenAdapter implements ProviderAdapter {
  name = 'adyen'
  async processPayment(payload: TransactionPayload, gateway: GatewayConfig): Promise<ProviderResult> {
    return { success: true, transactionRef: `ady_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, status: 'completed' }
  }
  async refund(transactionRef: string, amount?: number): Promise<ProviderResult> {
    return { success: true, transactionRef: `ady_re_${Date.now()}`, status: 'refunded' }
  }
  async getBalance(): Promise<{ available: number; pending: number; currency: Currency }> {
    return { available: 156780.00, pending: 8900.00, currency: 'EUR' }
  }
}

class StarkBankAdapter implements ProviderAdapter {
  name = 'stark'
  async processPayment(payload: TransactionPayload, gateway: GatewayConfig): Promise<ProviderResult> {
    return { success: true, transactionRef: `stark_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, status: 'completed' }
  }
  async refund(transactionRef: string, amount?: number): Promise<ProviderResult> {
    return { success: true, transactionRef: `stark_re_${Date.now()}`, status: 'refunded' }
  }
  async getBalance(): Promise<{ available: number; pending: number; currency: Currency }> {
    return { available: 234560.00, pending: 6700.00, currency: 'BRL' }
  }
}

const PROVIDER_REGISTRY: Record<string, ProviderAdapter> = {
  stripe: new StripeAdapter(),
  viva: new VivaAdapter(),
  mistic: new MisticAdapter(),
  adyen: new AdyenAdapter(),
  stark: new StarkBankAdapter(),
}

export function getProviderAdapter(providerName: string): ProviderAdapter | undefined {
  return PROVIDER_REGISTRY[providerName]
}

// ─── Ledger Reconciliation ─────────────────────────────────

export function buildLedgerEntries(transactionId: string, routing: RoutingDecision, payload: TransactionPayload): LedgerEntry[] {
  const entries: LedgerEntry[] = []

  // Main payment
  entries.push({
    transactionId,
    merchantId: payload.merchantId,
    type: 'payment',
    amount: routing.fees.netAmount,
    currency: routing.currency,
    gateway: routing.gateway,
    entityId: routing.entityId,
    description: `Payment via ${routing.gateway}`,
    status: 'settled',
  })

  // Fee entry
  if (routing.fees.totalFee > 0) {
    entries.push({
      transactionId,
      merchantId: payload.merchantId,
      type: 'fee',
      amount: -routing.fees.totalFee,
      currency: routing.currency,
      gateway: routing.gateway,
      entityId: routing.entityId,
      description: `Fee: ${(routing.fees.feeRate).toFixed(2)}% + ${routing.fees.feeFixed.toFixed(2)} (${TIER_CONFIG[routing.merchantTier].label} tier)`,
      status: 'settled',
    })
  }

  return entries
}

// ─── Gateway Status Monitor ────────────────────────────────

export interface GatewayStatus {
  name: string
  provider: string
  region: Region
  status: 'ACTIVE' | 'INACTIVE' | 'DEGRADED'
  latency: string
  volume: string
  currency: Currency
  feeRate: number
  entityId: string
  minTier: MerchantTier | null
}

export function getAllGatewayStatuses(): GatewayStatus[] {
  const statuses: GatewayStatus[] = []
  for (const [region, gateways] of Object.entries(GATEWAY_REGISTRY)) {
    for (const gw of gateways) {
      statuses.push({
        name: gw.gateway, provider: gw.provider, region: region as Region,
        status: gw.status, latency: gw.latency,
        volume: `${gw.currency === 'BRL' ? 'R$' : gw.currency === 'GBP' ? '\u00a3' : '\u20ac'}${(Math.random() * 500 + 50).toFixed(0)}K`,
        currency: gw.currency, feeRate: gw.feeRate, entityId: gw.entityId,
        minTier: gw.minTier || null,
      })
    }
  }
  return statuses
}

// ─── Volume Aggregation ────────────────────────────────────

export interface CurrencyVolume {
  currency: Currency; total: number; symbol: string; formatted: string
}

export function aggregateVolumesByCurrency(transactions: Array<{ amount: number; currency: string }>): CurrencyVolume[] {
  const totals: Record<string, number> = {}
  for (const tx of transactions) totals[tx.currency] = (totals[tx.currency] || 0) + tx.amount
  const symbols: Record<string, string> = { EUR: '\u20ac', GBP: '\u00a3', BRL: 'R$', USD: '$' }
  return Object.entries(totals)
    .map(([currency, total]) => ({
      currency: currency as Currency, total,
      symbol: symbols[currency] || '$',
      formatted: `${symbols[currency] || '$'}${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    }))
    .sort((a, b) => b.total - a.total)
}

// ─── Analytics ─────────────────────────────────────────────

export interface RoutingAnalytics {
  totalTransactions: number
  byLevel: Record<RoutingLevel, number>
  byRegion: Record<Region, number>
  byGateway: Record<string, { count: number; volume: number; successRate: number }>
  topFallbackUsed: string
  averageConfidence: number
}

export function computeRoutingAnalytics(decisions: RoutingDecision[]): RoutingAnalytics {
  const analytics: RoutingAnalytics = {
    totalTransactions: decisions.length,
    byLevel: { specific: 0, conditional: 0, tier: 0 },
    byRegion: { BR: 0, EU: 0, UK: 0, US: 0, LATAM: 0, PT: 0 },
    byGateway: {},
    topFallbackUsed: '',
    averageConfidence: 0,
  }
  const fallbackCounts: Record<string, number> = {}
  for (const d of decisions) {
    analytics.byLevel[d.routingLevel]++
    analytics.byRegion[d.region]++
    if (!analytics.byGateway[d.gateway]) analytics.byGateway[d.gateway] = { count: 0, volume: 0, successRate: 99.5 }
    analytics.byGateway[d.gateway].count++
    analytics.byGateway[d.gateway].volume += d.fees?.netAmount || 0
    fallbackCounts[d.fallbackGateway] = (fallbackCounts[d.fallbackGateway] || 0) + 1
    analytics.averageConfidence += d.confidence
  }
  analytics.averageConfidence = decisions.length > 0 ? analytics.averageConfidence / decisions.length : 0
  const topFallback = Object.entries(fallbackCounts).sort(([, a], [, b]) => b - a)[0]
  analytics.topFallbackUsed = topFallback ? topFallback[0] : ''
  return analytics
}
