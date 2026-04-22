import { db } from '@/lib/db'
import {
  routeTransaction,
  findGatewayConfig,
  calculateFees,
  buildLedgerEntries,
  TIER_CONFIG,
  LEGAL_ENTITIES,
  getAllGatewayStatuses,
  type RoutingRule,
  type TransactionPayload,
  type MerchantTier,
} from '@/lib/nexflowx'
import { NextRequest, NextResponse } from 'next/server'

function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'ATX-'
  for (let i = 0; i < 12; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

// POST /api/v2/payments/process — NeXFlowX v2 Payment Processing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      email,
      merchantName,
      merchantId,
      amount,
      currency,
      region,
      country,
      paymentMethod,
      customerId,
      merchantTier: incomingTier,
    } = body

    // ── Validation ──────────────────────────────────────────
    if (!email || !merchantName || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: 'email, merchantName, and a positive amount are required' },
        { status: 400 },
      )
    }

    if (amount > 999_999_999) {
      return NextResponse.json(
        { error: 'Amount exceeds maximum limit of 999,999,999' },
        { status: 400 },
      )
    }

    // ── Determine merchant tier ──────────────────────────────
    let resolvedTier: MerchantTier = 'bronze'
    if (incomingTier && ['bronze', 'silver', 'gold'].includes(incomingTier)) {
      resolvedTier = incomingTier as MerchantTier
    } else if (merchantId) {
      const merchant = await db.merchant.findUnique({ where: { id: merchantId }, select: { tier: true } })
      if (merchant) resolvedTier = merchant.tier as MerchantTier
    }

    const parsedAmount = parseFloat(amount)

    const routingPayload: TransactionPayload = {
      amount: parsedAmount,
      currency: currency || undefined,
      region: region || undefined,
      merchantCountry: country || undefined,
      merchantId: merchantId || undefined,
      merchantTier: resolvedTier,
      paymentMethod: paymentMethod || undefined,
      customerId: customerId || undefined,
    }

    // ── Fetch merchant-specific routing rules ────────────────
    let rules: RoutingRule[] = []
    if (merchantId) {
      const dbRules = await db.routingRule.findMany({
        where: { merchantId, enabled: true },
        orderBy: { priority: 'asc' },
      })
      rules = dbRules.map(r => ({
        id: r.id,
        merchantId: r.merchantId,
        priority: r.priority,
        level: r.level as RoutingRule['level'],
        conditions: r.conditions as RoutingRule['conditions'],
        gateway: r.gateway,
        fallbackGateway: r.fallbackGateway,
        enabled: r.enabled,
        hitCount: r.hitCount,
        successCount: r.successCount,
      }))
    }

    // ── Execute NeXFlowX 3-level routing ─────────────────────
    const routing = routeTransaction(routingPayload, rules)

    // ── Calculate fees with tier discount ────────────────────
    const gwConfig = findGatewayConfig(routing.gateway)
    const fees = gwConfig
      ? calculateFees(parsedAmount, gwConfig, resolvedTier)
      : { feeRate: 0, feeFixed: 0, totalFee: 0, netAmount: parsedAmount }

    // ── Upsert user ──────────────────────────────────────────
    const user = await db.user.upsert({
      where: { email },
      create: { email, name: merchantName },
      update: {},
    })

    // ── Create transaction with full routing metadata ────────
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        merchantId: merchantId || null,
        merchantName,
        amount: parsedAmount,
        currency: routing.currency,
        gateway: routing.gateway,
        region: routing.region,
        routingEngine: 'NeXFlowX',
        routingLevel: routing.routingLevel,
        confidence: routing.confidence,
        entityId: routing.entityId,
        entityName: routing.entityName,
        fallbackGateway: routing.fallbackGateway,
        feeAmount: fees.totalFee,
        feeRate: fees.feeRate,
        netAmount: fees.netAmount,
        customerId: customerId || null,
        reference: generateRef(),
        status: 'processing',
        metadata: {
          ...body,
          routingTimestamp: routing.timestamp,
          ruleId: routing.ruleId || null,
          merchantTier: resolvedTier,
          tierConfig: {
            label: TIER_CONFIG[resolvedTier].label,
            feeDiscount: TIER_CONFIG[resolvedTier].feeDiscount,
            maxRules: TIER_CONFIG[resolvedTier].maxRules,
          },
          gatewayFees: {
            feeRate: fees.feeRate,
            feeFixed: fees.feeFixed,
            totalFee: fees.totalFee,
            netAmount: fees.netAmount,
          },
        },
      },
    })

    // ── Build & create ledger entries ────────────────────────
    const ledgerEntries = buildLedgerEntries(transaction.id, routing, routingPayload)

    if (ledgerEntries.length > 0) {
      await db.ledgerEntry.createMany({
        data: ledgerEntries.map(entry => ({
          transactionId: entry.transactionId,
          merchantId: entry.merchantId || null,
          type: entry.type,
          amount: entry.amount,
          currency: entry.currency,
          status: entry.status,
          gateway: entry.gateway,
          entityId: entry.entityId || null,
          description: entry.description || null,
        })),
      })
    }

    // ── Mark transaction completed ───────────────────────────
    const completedTx = await db.transaction.update({
      where: { id: transaction.id },
      data: { status: 'completed' },
    })

    // ── Update routing rule hit stats ────────────────────────
    if (routing.ruleId) {
      await db.routingRule.update({
        where: { id: routing.ruleId },
        data: { hitCount: { increment: 1 }, successCount: { increment: 1 }, lastHitAt: new Date() },
      })
    }

    return NextResponse.json({
      success: true,
      transaction: completedTx,
      routing: {
        gateway: routing.gateway,
        region: routing.region,
        currency: routing.currency,
        routingLevel: routing.routingLevel,
        confidence: routing.confidence,
        entityId: routing.entityId,
        entityName: routing.entityName,
        estimatedLatency: routing.estimatedLatency,
        fallbackGateway: routing.fallbackGateway,
        ruleId: routing.ruleId || null,
        merchantTier: resolvedTier,
        timestamp: routing.timestamp,
      },
      fees: {
        rate: fees.feeRate,
        fixed: fees.feeFixed,
        total: fees.totalFee,
        netAmount: fees.netAmount,
        tierApplied: TIER_CONFIG[resolvedTier].label,
        discountApplied: TIER_CONFIG[resolvedTier].feeDiscount,
      },
      ledger: {
        entriesCreated: ledgerEntries.length,
        types: ledgerEntries.map(e => e.type),
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[NeXFlowX v2] Payment processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 },
    )
  }
}

// GET /api/v2/payments/process — Health check & full routing test
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const testRouting = searchParams.get('test') === 'true'

    if (testRouting) {
      // ── Test routing across ALL regions with various tiers ──
      const regions = ['BR', 'EU', 'UK', 'US', 'LATAM', 'PT'] as const
      const tiers: MerchantTier[] = ['bronze', 'silver', 'gold']
      const methodsByRegion: Record<string, string[]> = {
        BR: ['credit_card', 'pix', 'boleto'],
        EU: ['credit_card', 'sepa', 'ideal'],
        UK: ['credit_card', 'open_banking', 'bacs'],
        US: ['credit_card', 'ach'],
        LATAM: ['credit_card', 'pix'],
        PT: ['credit_card', 'mbway', 'multibanco'],
      }
      const currencies: Record<string, string> = {
        BR: 'BRL', EU: 'EUR', UK: 'GBP', US: 'USD', LATAM: 'BRL', PT: 'EUR',
      }

      const testResults: Array<{
        region: string
        tier: MerchantTier
        amount: number
        method: string
        decision: ReturnType<typeof routeTransaction>
      }> = []

      for (const region of regions) {
        const methods = methodsByRegion[region]
        const currency = currencies[region] as TransactionPayload['currency']
        for (const tier of tiers) {
          const method = methods[Math.floor(Math.random() * methods.length)]
          const testPayload: TransactionPayload = {
            amount: Math.round(Math.random() * 9000 + 100),
            currency,
            region,
            paymentMethod: method,
            merchantTier: tier,
          }
          const decision = routeTransaction(testPayload)
          testResults.push({
            region,
            tier,
            amount: testPayload.amount,
            method,
            decision,
          })
        }
      }

      // ── Get all gateway statuses ───────────────────────────
      const gatewayStatuses = getAllGatewayStatuses()
      const activeGateways = gatewayStatuses.filter(g => g.status === 'ACTIVE')
      const inactiveGateways = gatewayStatuses.filter(g => g.status === 'INACTIVE')
      const degradedGateways = gatewayStatuses.filter(g => g.status === 'DEGRADED')

      return NextResponse.json({
        engine: 'NeXFlowX v2.0',
        status: 'operational',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        legalEntities: LEGAL_ENTITIES,
        tierSystem: TIER_CONFIG,
        testResults,
        testSummary: {
          totalTests: testResults.length,
          regionsTested: regions.length,
          tiersTested: tiers.length,
          byRoutingLevel: {
            specific: testResults.filter(r => r.decision.routingLevel === 'specific').length,
            conditional: testResults.filter(r => r.decision.routingLevel === 'conditional').length,
            tier: testResults.filter(r => r.decision.routingLevel === 'tier').length,
          },
        },
        gateways: {
          total: gatewayStatuses.length,
          active: activeGateways.length,
          inactive: inactiveGateways.length,
          degraded: degradedGateways.length,
          statuses: gatewayStatuses.map(g => ({
            name: g.name,
            provider: g.provider,
            region: g.region,
            status: g.status,
            latency: g.latency,
            currency: g.currency,
            feeRate: g.feeRate,
            entityId: g.entityId,
            minTier: g.minTier,
            volume: g.volume,
          })),
        },
      })
    }

    // ── Default health check ─────────────────────────────────
    return NextResponse.json({
      engine: 'NeXFlowX v2.0',
      status: 'operational',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        process: 'POST /api/v2/payments/process',
        test: 'GET /api/v2/payments/process?test=true',
      },
      legalEntities: Object.keys(LEGAL_ENTITIES),
      supportedRegions: ['BR', 'EU', 'UK', 'US', 'LATAM', 'PT'],
      supportedCurrencies: ['EUR', 'GBP', 'BRL', 'USD'],
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 })
  }
}
