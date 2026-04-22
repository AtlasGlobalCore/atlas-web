import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import type { MerchantTier } from '@/lib/nexflowx'
import { TIER_CONFIG } from '@/lib/nexflowx'

// ── Mock Merchants (used when DB is empty) ───────────────────
const MOCK_MERCHANTS = [
  {
    id: 'mock_m_001',
    name: 'TechNova Solutions',
    slug: 'technova-solutions',
    country: 'FR',
    region: 'EU',
    legalEntityId: 'FR_EI_2013',
    status: 'active',
    tier: 'gold',
    monthlyVolume: 342000,
    chargebackRate: 0.12,
    approvalRate: 98.7,
    allowedMethods: ['credit_card', 'sepa', 'apple_pay', 'google_pay'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2025-01-10T14:22:00Z',
  },
  {
    id: 'mock_m_002',
    name: 'Brew & Bean Co.',
    slug: 'brew-bean-co',
    country: 'UK',
    region: 'UK',
    legalEntityId: 'UK_LTD_16568194',
    status: 'active',
    tier: 'silver',
    monthlyVolume: 87500,
    chargebackRate: 0.31,
    approvalRate: 97.2,
    allowedMethods: ['credit_card', 'debit_card', 'open_banking', 'apple_pay'],
    createdAt: '2024-03-22T09:15:00Z',
    updatedAt: '2025-01-09T11:45:00Z',
  },
  {
    id: 'mock_m_003',
    name: 'PixelCraft Studio',
    slug: 'pixelcraft-studio',
    country: 'PT',
    region: 'PT',
    legalEntityId: 'PT_ENI',
    status: 'active',
    tier: 'silver',
    monthlyVolume: 62300,
    chargebackRate: 0.18,
    approvalRate: 98.1,
    allowedMethods: ['credit_card', 'mbway', 'multibanco', 'sepa'],
    createdAt: '2024-04-10T16:00:00Z',
    updatedAt: '2025-01-08T09:30:00Z',
  },
  {
    id: 'mock_m_004',
    name: 'BrasilShop Express',
    slug: 'brasilshop-express',
    country: 'BR',
    region: 'BR',
    legalEntityId: 'BR_HUB',
    status: 'active',
    tier: 'bronze',
    monthlyVolume: 15400,
    chargebackRate: 0.45,
    approvalRate: 95.8,
    allowedMethods: ['credit_card', 'pix', 'boleto'],
    createdAt: '2024-06-01T12:00:00Z',
    updatedAt: '2025-01-07T16:10:00Z',
  },
  {
    id: 'mock_m_005',
    name: 'Alpine Apparel',
    slug: 'alpine-apparel',
    country: 'DE',
    region: 'EU',
    legalEntityId: 'FR_EI_2013',
    status: 'active',
    tier: 'gold',
    monthlyVolume: 489000,
    chargebackRate: 0.08,
    approvalRate: 99.3,
    allowedMethods: ['credit_card', 'sepa', 'ideal', 'sofort', 'apple_pay', 'google_pay'],
    createdAt: '2023-11-20T08:45:00Z',
    updatedAt: '2025-01-10T18:00:00Z',
  },
  {
    id: 'mock_m_006',
    name: 'São Paulo Digital',
    slug: 'sao-paulo-digital',
    country: 'BR',
    region: 'BR',
    legalEntityId: 'BR_HUB',
    status: 'active',
    tier: 'silver',
    monthlyVolume: 54200,
    chargebackRate: 0.22,
    approvalRate: 97.5,
    allowedMethods: ['credit_card', 'pix', 'boleto'],
    createdAt: '2024-05-18T14:30:00Z',
    updatedAt: '2025-01-06T10:20:00Z',
  },
  {
    id: 'mock_m_007',
    name: 'London Fintech Labs',
    slug: 'london-fintech-labs',
    country: 'GB',
    region: 'UK',
    legalEntityId: 'UK_LTD_16568194',
    status: 'pending',
    tier: 'bronze',
    monthlyVolume: 0,
    chargebackRate: 0,
    approvalRate: 0,
    allowedMethods: [],
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-01-05T09:00:00Z',
  },
  {
    id: 'mock_m_008',
    name: 'Lisbon Handmade',
    slug: 'lisbon-handmade',
    country: 'PT',
    region: 'PT',
    legalEntityId: 'PT_ENI',
    status: 'suspended',
    tier: 'bronze',
    monthlyVolume: 3200,
    chargebackRate: 1.2,
    approvalRate: 91.4,
    allowedMethods: ['credit_card', 'mbway'],
    createdAt: '2024-02-14T11:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z',
  },
  {
    id: 'mock_m_009',
    name: 'Madrid Electronica',
    slug: 'madrid-electronica',
    country: 'ES',
    region: 'EU',
    legalEntityId: 'FR_EI_2013',
    status: 'active',
    tier: 'bronze',
    monthlyVolume: 21800,
    chargebackRate: 0.38,
    approvalRate: 96.5,
    allowedMethods: ['credit_card', 'sepa', 'bizum'],
    createdAt: '2024-07-03T10:00:00Z',
    updatedAt: '2025-01-09T08:15:00Z',
  },
  {
    id: 'mock_m_010',
    name: 'NYC Premium Goods',
    slug: 'nyc-premium-goods',
    country: 'US',
    region: 'US',
    legalEntityId: 'UK_LTD_16568194',
    status: 'active',
    tier: 'gold',
    monthlyVolume: 567000,
    chargebackRate: 0.06,
    approvalRate: 99.5,
    allowedMethods: ['credit_card', 'ach', 'apple_pay', 'google_pay'],
    createdAt: '2023-09-01T13:30:00Z',
    updatedAt: '2025-01-10T20:00:00Z',
  },
]

// GET /api/v2/merchants — List merchants with tier, status, volume, approval rate
export async function GET(_req: NextRequest) {
  try {
    // ── Try DB first ─────────────────────────────────────────
    let merchants = await db.merchant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { transactions: true, routingRules: true } },
      },
    })

    // ── Fall back to mock data if DB is empty ────────────────
    if (merchants.length === 0) {
      return NextResponse.json({
        success: true,
        source: 'mock',
        count: MOCK_MERCHANTS.length,
        merchants: MOCK_MERCHANTS.map(m => ({
          ...m,
          tierConfig: TIER_CONFIG[m.tier as MerchantTier]
            ? {
                label: TIER_CONFIG[m.tier as MerchantTier].label,
                color: TIER_CONFIG[m.tier as MerchantTier].color,
                feeDiscount: TIER_CONFIG[m.tier as MerchantTier].feeDiscount,
                maxRules: TIER_CONFIG[m.tier as MerchantTier].maxRules,
              }
            : null,
          transactionCount: Math.round(m.monthlyVolume / 154.49),
          ruleCount: m.tier === 'gold' ? 12 : m.tier === 'silver' ? 6 : 2,
        })),
        summary: {
          total: MOCK_MERCHANTS.length,
          byStatus: {
            active: MOCK_MERCHANTS.filter(m => m.status === 'active').length,
            pending: MOCK_MERCHANTS.filter(m => m.status === 'pending').length,
            suspended: MOCK_MERCHANTS.filter(m => m.status === 'suspended').length,
            closed: MOCK_MERCHANTS.filter(m => m.status === 'closed').length,
          },
          byTier: {
            bronze: MOCK_MERCHANTS.filter(m => m.tier === 'bronze').length,
            silver: MOCK_MERCHANTS.filter(m => m.tier === 'silver').length,
            gold: MOCK_MERCHANTS.filter(m => m.tier === 'gold').length,
          },
          byRegion: {
            EU: MOCK_MERCHANTS.filter(m => m.region === 'EU').length,
            UK: MOCK_MERCHANTS.filter(m => m.region === 'UK').length,
            BR: MOCK_MERCHANTS.filter(m => m.region === 'BR').length,
            PT: MOCK_MERCHANTS.filter(m => m.region === 'PT').length,
            US: MOCK_MERCHANTS.filter(m => m.region === 'US').length,
          },
        },
      })
    }

    // ── Format DB results ────────────────────────────────────
    const formatted = merchants.map(m => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      country: m.country,
      region: m.region,
      legalEntityId: m.legalEntityId,
      status: m.status,
      tier: m.tier,
      monthlyVolume: m.monthlyVolume,
      chargebackRate: m.chargebackRate,
      approvalRate: m.approvalRate,
      allowedMethods: m.allowedMethods,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      tierConfig: TIER_CONFIG[m.tier as MerchantTier]
        ? {
            label: TIER_CONFIG[m.tier as MerchantTier].label,
            color: TIER_CONFIG[m.tier as MerchantTier].color,
            feeDiscount: TIER_CONFIG[m.tier as MerchantTier].feeDiscount,
            maxRules: TIER_CONFIG[m.tier as MerchantTier].maxRules,
          }
        : null,
      transactionCount: m._count.transactions,
      ruleCount: m._count.routingRules,
    }))

    return NextResponse.json({
      success: true,
      source: 'database',
      count: formatted.length,
      merchants: formatted,
      summary: {
        total: formatted.length,
        byStatus: {
          active: formatted.filter(m => m.status === 'active').length,
          pending: formatted.filter(m => m.status === 'pending').length,
          suspended: formatted.filter(m => m.status === 'suspended').length,
          closed: formatted.filter(m => m.status === 'closed').length,
        },
        byTier: {
          bronze: formatted.filter(m => m.tier === 'bronze').length,
          silver: formatted.filter(m => m.tier === 'silver').length,
          gold: formatted.filter(m => m.tier === 'gold').length,
        },
        byRegion: {
          EU: formatted.filter(m => m.region === 'EU').length,
          UK: formatted.filter(m => m.region === 'UK').length,
          BR: formatted.filter(m => m.region === 'BR').length,
          PT: formatted.filter(m => m.region === 'PT').length,
          US: formatted.filter(m => m.region === 'US').length,
        },
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Merchants API] Error fetching merchants:', error)
    return NextResponse.json({ error: 'Failed to fetch merchants', details: message }, { status: 500 })
  }
}
