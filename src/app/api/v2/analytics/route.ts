import { NextRequest, NextResponse } from 'next/server'
import type { Currency } from '@/lib/nexflowx'

// GET /api/v2/analytics — Dashboard analytics data for Recharts
export async function GET(_req: NextRequest) {
  try {
    // ── KPI Summary ──────────────────────────────────────────
    const kpi = {
      totalVolume: 2_847_320.45,
      totalTransactions: 18_432,
      successRate: 97.8,
      avgTransactionValue: 154.49,
      activeMerchants: 47,
      activeGateways: 16,
      chargebackRate: 0.23,
      refundRate: 1.8,
    }

    // ── Approval Rate by Gateway (for BarChart) ──────────────
    const approvalByGateway = [
      { name: 'Stripe', value: 98.2, color: '#6366f1', transactions: 7240 },
      { name: 'Viva Wallet', value: 96.8, color: '#06b6d4', transactions: 3890 },
      { name: 'Mistic', value: 97.5, color: '#f59e0b', transactions: 4120 },
      { name: 'Adyen', value: 99.1, color: '#10b981', transactions: 2180 },
      { name: 'Stark Bank', value: 98.9, color: '#8b5cf6', transactions: 1002 },
    ]

    // ── Volume by Region (for BarChart) ──────────────────────
    const volumeByRegion = [
      { name: 'EU', value: 1_245_600, transactions: 7_890, color: '#06b6d4' },
      { name: 'UK', value: 623_400, transactions: 3_456, color: '#10b981' },
      { name: 'BR', value: 487_800, transactions: 4_210, color: '#f59e0b' },
      { name: 'PT', value: 234_120, transactions: 1_540, color: '#ec4899' },
      { name: 'US', value: 178_900, transactions: 890, color: '#6366f1' },
      { name: 'LATAM', value: 77_500, transactions: 446, color: '#ef4444' },
    ]

    // ── Daily Volume (30 days for AreaChart) ─────────────────
    const dailyVolume: Array<{ name: string; volume: number; transactions: number }> = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`
      // Simulate realistic volume with some variance
      const dayOfWeek = date.getDay()
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.55 : 1
      const trendFactor = 1 + (30 - i) * 0.003 // slight upward trend
      const randomVariance = 0.8 + Math.random() * 0.4
      const baseVolume = 85000 * weekendFactor * trendFactor * randomVariance
      const baseTx = 550 * weekendFactor * trendFactor * randomVariance

      dailyVolume.push({
        name: dayLabel,
        volume: Math.round(baseVolume * 100) / 100,
        transactions: Math.round(baseTx),
      })
    }

    // ── Routing Level Breakdown (for PieChart) ───────────────
    const routingBreakdown = [
      { name: 'Specific Rules', value: 3_420, percentage: 18.6, color: '#10b981' },
      { name: 'Conditional', value: 8_760, percentage: 47.5, color: '#f59e0b' },
      { name: 'Tier Fallback', value: 6_252, percentage: 33.9, color: '#ef4444' },
    ]

    // ── Currency Split (for PieChart) ────────────────────────
    const currencySplit: Array<{ name: string; value: number; percentage: number; symbol: string }> = [
      { name: 'EUR', value: 1_628_340, percentage: 57.2, symbol: '€' },
      { name: 'GBP', value: 623_400, percentage: 21.9, symbol: '£' },
      { name: 'BRL', value: 565_300, percentage: 19.9, symbol: 'R$' },
      { name: 'USD', value: 30_280, percentage: 1.0, symbol: '$' },
    ]

    // ── Payment Methods (for BarChart) ───────────────────────
    const paymentMethods = [
      { name: 'Credit Card', value: 8_920, color: '#6366f1' },
      { name: 'PIX', value: 3_240, color: '#10b981' },
      { name: 'SEPA', value: 2_890, color: '#06b6d4' },
      { name: 'Debit Card', value: 1_670, color: '#f59e0b' },
      { name: 'Open Banking', value: 890, color: '#8b5cf6' },
      { name: 'MBWay', value: 560, color: '#ec4899' },
      { name: 'Apple Pay', value: 420, color: '#14b8a6' },
      { name: 'Other', value: 842, color: '#94a3b8' },
    ]

    // ── LTV Analysis ─────────────────────────────────────────
    const ltvAnalysis = {
      average: 2_340.50,
      median: 1_850.00,
      distribution: [
        { name: '€0–500', value: 6_240, color: '#ef4444' },
        { name: '€500–2K', value: 5_890, color: '#f59e0b' },
        { name: '€2K–5K', value: 3_420, color: '#06b6d4' },
        { name: '€5K–10K', value: 1_820, color: '#10b981' },
        { name: '€10K+', value: 1_062, color: '#6366f1' },
      ],
    }

    // ── Churn Risk Distribution ──────────────────────────────
    const churnRisk = [
      { name: 'Low (< 0.2)', value: 12_890, percentage: 69.9, color: '#10b981' },
      { name: 'Medium (0.2–0.5)', value: 3_680, percentage: 20.0, color: '#f59e0b' },
      { name: 'High (0.5–0.8)', value: 1_340, percentage: 7.3, color: '#ef4444' },
      { name: 'Critical (> 0.8)', value: 522, percentage: 2.8, color: '#991b1b' },
    ]

    // ── Transaction Status Split ─────────────────────────────
    const transactionStatuses = [
      { name: 'Completed', value: 18_034, color: '#10b981' },
      { name: 'Pending', value: 215, color: '#f59e0b' },
      { name: 'Failed', value: 112, color: '#ef4444' },
      { name: 'Refunded', value: 332, color: '#6366f1' },
      { name: 'Chargeback', value: 42, color: '#991b1b' },
    ]

    // ── Merchant Tier Distribution ───────────────────────────
    const tierDistribution = [
      { name: 'Bronze', value: 28, color: '#CD7F32', avgVolume: 12_400 },
      { name: 'Silver', value: 14, color: '#C0C0C0', avgVolume: 87_500 },
      { name: 'Gold', value: 5, color: '#FFD700', avgVolume: 342_000 },
    ]

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      period: {
        from: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: today.toISOString(),
      },
      kpi,
      approvalByGateway,
      volumeByRegion,
      dailyVolume,
      routingBreakdown,
      currencySplit,
      paymentMethods,
      ltvAnalysis,
      churnRisk,
      transactionStatuses,
      tierDistribution,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Analytics API] Error generating analytics:', error)
    return NextResponse.json({ error: 'Failed to generate analytics', details: message }, { status: 500 })
  }
}
