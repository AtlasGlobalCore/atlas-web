import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// ── Mock CRM Customers ───────────────────────────────────────
const MOCK_CUSTOMERS = [
  {
    id: 'mock_c_001',
    merchantId: 'mock_m_001',
    email: 'elena.vasquez@techcorp.eu',
    name: 'Elena Vasquez',
    phone: '+33 6 12 34 56 78',
    country: 'FR',
    company: 'TechCorp',
    tags: ['vip', 'enterprise', 'eur-sepa'],
    totalSpent: 48720.50,
    txCount: 312,
    avgOrderValue: 156.15,
    ltv: 72400,
    churnRisk: 0.08,
    firstSeenAt: '2023-06-15T08:30:00Z',
    lastSeenAt: '2025-01-10T16:45:00Z',
    createdAt: '2023-06-15T08:30:00Z',
    updatedAt: '2025-01-10T16:45:00Z',
  },
  {
    id: 'mock_c_002',
    merchantId: 'mock_m_002',
    email: 'james.baker@brewbean.co.uk',
    name: 'James Baker',
    phone: '+44 7700 900123',
    country: 'GB',
    company: null,
    tags: ['recurring', 'subscription', 'gbp'],
    totalSpent: 3240.00,
    txCount: 48,
    avgOrderValue: 67.50,
    ltv: 8900,
    churnRisk: 0.15,
    firstSeenAt: '2024-02-20T14:00:00Z',
    lastSeenAt: '2025-01-09T10:20:00Z',
    createdAt: '2024-02-20T14:00:00Z',
    updatedAt: '2025-01-09T10:20:00Z',
  },
  {
    id: 'mock_c_003',
    merchantId: 'mock_m_005',
    email: 'anna.schmidt@alpineapparel.de',
    name: 'Anna Schmidt',
    phone: '+49 170 1234567',
    country: 'DE',
    company: 'Alpine Retail GmbH',
    tags: ['wholesale', 'high-value', 'eur-sepa', 'b2b'],
    totalSpent: 124800.00,
    txCount: 86,
    avgOrderValue: 1451.16,
    ltv: 198000,
    churnRisk: 0.04,
    firstSeenAt: '2023-09-10T09:00:00Z',
    lastSeenAt: '2025-01-10T12:00:00Z',
    createdAt: '2023-09-10T09:00:00Z',
    updatedAt: '2025-01-10T12:00:00Z',
  },
  {
    id: 'mock_c_004',
    merchantId: 'mock_m_004',
    email: 'carlos.silva@gmail.com',
    name: 'Carlos Silva',
    phone: '+55 11 91234 5678',
    country: 'BR',
    company: null,
    tags: ['pix-user', 'recurrent', 'brl'],
    totalSpent: 2890.00,
    txCount: 34,
    avgOrderValue: 85.00,
    ltv: 4200,
    churnRisk: 0.42,
    firstSeenAt: '2024-05-15T18:30:00Z',
    lastSeenAt: '2024-12-28T20:15:00Z',
    createdAt: '2024-05-15T18:30:00Z',
    updatedAt: '2024-12-28T20:15:00Z',
  },
  {
    id: 'mock_c_005',
    merchantId: 'mock_m_003',
    email: 'maria.santos@pixeldesign.pt',
    name: 'Maria Santos',
    phone: '+351 912 345 678',
    country: 'PT',
    company: 'Pixel Design Studio',
    tags: ['mbway', 'recurring', 'eur-sepa', 'designer'],
    totalSpent: 6780.50,
    txCount: 42,
    avgOrderValue: 161.44,
    ltv: 12500,
    churnRisk: 0.11,
    firstSeenAt: '2024-01-20T11:45:00Z',
    lastSeenAt: '2025-01-08T15:30:00Z',
    createdAt: '2024-01-20T11:45:00Z',
    updatedAt: '2025-01-08T15:30:00Z',
  },
  {
    id: 'mock_c_006',
    merchantId: 'mock_m_010',
    email: 'sarah.johnson@nycpremium.com',
    name: 'Sarah Johnson',
    phone: '+1 212 555 0142',
    country: 'US',
    company: 'NYC Premium Retail',
    tags: ['vip', 'enterprise', 'usd', 'apple-pay'],
    totalSpent: 89450.00,
    txCount: 156,
    avgOrderValue: 573.40,
    ltv: 145000,
    churnRisk: 0.05,
    firstSeenAt: '2023-08-10T14:00:00Z',
    lastSeenAt: '2025-01-10T19:30:00Z',
    createdAt: '2023-08-10T14:00:00Z',
    updatedAt: '2025-01-10T19:30:00Z',
  },
  {
    id: 'mock_c_007',
    merchantId: 'mock_m_006',
    email: 'pedro.oliveira@spdigital.br',
    name: 'Pedro Oliveira',
    phone: '+55 11 98765 4321',
    country: 'BR',
    company: 'SP Digital Solutions',
    tags: ['b2b', 'subscription', 'brl', 'pix-user'],
    totalSpent: 15600.00,
    txCount: 24,
    avgOrderValue: 650.00,
    ltv: 28900,
    churnRisk: 0.18,
    firstSeenAt: '2024-03-05T10:00:00Z',
    lastSeenAt: '2025-01-06T11:45:00Z',
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2025-01-06T11:45:00Z',
  },
  {
    id: 'mock_c_008',
    merchantId: 'mock_m_009',
    email: 'lucia.garcia@electronica.es',
    name: 'Lucía García',
    phone: '+34 612 345 678',
    country: 'ES',
    company: null,
    tags: ['new-customer', 'eur-sepa'],
    totalSpent: 320.00,
    txCount: 4,
    avgOrderValue: 80.00,
    ltv: 850,
    churnRisk: 0.68,
    firstSeenAt: '2024-12-15T16:00:00Z',
    lastSeenAt: '2024-12-22T09:30:00Z',
    createdAt: '2024-12-15T16:00:00Z',
    updatedAt: '2024-12-22T09:30:00Z',
  },
  {
    id: 'mock_c_009',
    merchantId: 'mock_m_001',
    email: 'thomas.mueller@innovation.de',
    name: 'Thomas Müller',
    phone: '+49 171 9876543',
    country: 'DE',
    company: 'Innovation Labs AG',
    tags: ['enterprise', 'b2b', 'high-value', 'eur-sepa'],
    totalSpent: 210500.00,
    txCount: 128,
    avgOrderValue: 1644.53,
    ltv: 385000,
    churnRisk: 0.02,
    firstSeenAt: '2023-04-01T08:00:00Z',
    lastSeenAt: '2025-01-10T17:00:00Z',
    createdAt: '2023-04-01T08:00:00Z',
    updatedAt: '2025-01-10T17:00:00Z',
  },
  {
    id: 'mock_c_010',
    merchantId: 'mock_m_005',
    email: 'sofia.rossi@milanostyle.it',
    name: 'Sofia Rossi',
    phone: '+39 339 123 4567',
    country: 'IT',
    company: 'Milano Style Srl',
    tags: ['wholesale', 'eur-sepa', 'recurring'],
    totalSpent: 67800.00,
    txCount: 64,
    avgOrderValue: 1059.38,
    ltv: 112000,
    churnRisk: 0.12,
    firstSeenAt: '2023-11-15T10:30:00Z',
    lastSeenAt: '2025-01-09T14:20:00Z',
    createdAt: '2023-11-15T10:30:00Z',
    updatedAt: '2025-01-09T14:20:00Z',
  },
  {
    id: 'mock_c_011',
    merchantId: 'mock_m_008',
    email: 'joao.ferreira@mail.pt',
    name: 'João Ferreira',
    phone: '+351 967 654 321',
    country: 'PT',
    company: null,
    tags: ['churn-risk', 'mbway'],
    totalSpent: 145.00,
    txCount: 2,
    avgOrderValue: 72.50,
    ltv: 210,
    churnRisk: 0.82,
    firstSeenAt: '2024-11-01T13:00:00Z',
    lastSeenAt: '2024-11-08T15:30:00Z',
    createdAt: '2024-11-01T13:00:00Z',
    updatedAt: '2024-11-08T15:30:00Z',
  },
  {
    id: 'mock_c_012',
    merchantId: 'mock_m_010',
    email: 'michael.chen@premiumco.com',
    name: 'Michael Chen',
    phone: '+1 415 555 0198',
    country: 'US',
    company: 'PremiumCo Inc.',
    tags: ['vip', 'enterprise', 'usd', 'b2b', 'ach'],
    totalSpent: 345000.00,
    txCount: 210,
    avgOrderValue: 1642.86,
    ltv: 520000,
    churnRisk: 0.03,
    firstSeenAt: '2023-05-20T09:00:00Z',
    lastSeenAt: '2025-01-10T20:15:00Z',
    createdAt: '2023-05-20T09:00:00Z',
    updatedAt: '2025-01-10T20:15:00Z',
  },
]

// GET /api/v2/customers — CRM endpoint with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const merchantIdFilter = searchParams.get('merchantId')
    const searchQuery = searchParams.get('search')?.toLowerCase() || ''

    // ── Try DB first ─────────────────────────────────────────
    let dbCustomers = await db.customer.findMany({
      where: {
        ...(merchantIdFilter ? { merchantId: merchantIdFilter } : {}),
        ...(searchQuery
          ? {
              OR: [
                { name: { contains: searchQuery } },
                { email: { contains: searchQuery } },
                { company: { contains: searchQuery } },
              ],
            }
          : {}),
      },
      orderBy: { lastSeenAt: 'desc' },
    })

    // ── Fall back to mock data if DB is empty ────────────────
    if (dbCustomers.length === 0) {
      let filtered = [...MOCK_CUSTOMERS]

      if (merchantIdFilter) {
        filtered = filtered.filter(c => c.merchantId === merchantIdFilter)
      }

      if (searchQuery) {
        filtered = filtered.filter(
          c =>
            c.name?.toLowerCase().includes(searchQuery) ||
            c.email.toLowerCase().includes(searchQuery) ||
            c.company?.toLowerCase().includes(searchQuery) ||
            c.tags.some(t => t.toLowerCase().includes(searchQuery)),
        )
      }

      const churnRiskLabel = (risk: number) => {
        if (risk < 0.2) return 'low'
        if (risk < 0.5) return 'medium'
        if (risk < 0.8) return 'high'
        return 'critical'
      }

      const formatted = filtered.map(c => ({
        ...c,
        churnRiskLabel: churnRiskLabel(c.churnRisk),
        daysSinceLastSeen: Math.floor(
          (Date.now() - new Date(c.lastSeenAt).getTime()) / (1000 * 60 * 60 * 24),
        ),
      }))

      return NextResponse.json({
        success: true,
        source: 'mock',
        count: formatted.length,
        filters: {
          merchantId: merchantIdFilter || null,
          search: searchQuery || null,
        },
        customers: formatted,
        summary: {
          totalCustomers: MOCK_CUSTOMERS.length,
          filteredCount: formatted.length,
          totalLtv: filtered.reduce((sum, c) => sum + c.ltv, 0),
          avgLtv: filtered.length > 0
            ? Math.round(filtered.reduce((sum, c) => sum + c.ltv, 0) / filtered.length)
            : 0,
          totalSpent: filtered.reduce((sum, c) => sum + c.totalSpent, 0),
          avgChurnRisk: filtered.length > 0
            ? Math.round((filtered.reduce((sum, c) => sum + c.churnRisk, 0) / filtered.length) * 100) / 100
            : 0,
          byRiskLevel: {
            low: filtered.filter(c => c.churnRisk < 0.2).length,
            medium: filtered.filter(c => c.churnRisk >= 0.2 && c.churnRisk < 0.5).length,
            high: filtered.filter(c => c.churnRisk >= 0.5 && c.churnRisk < 0.8).length,
            critical: filtered.filter(c => c.churnRisk >= 0.8).length,
          },
        },
      })
    }

    // ── Format DB results ────────────────────────────────────
    const churnRiskLabel = (risk: number) => {
      if (risk < 0.2) return 'low'
      if (risk < 0.5) return 'medium'
      if (risk < 0.8) return 'high'
      return 'critical'
    }

    const formatted = dbCustomers.map(c => ({
      id: c.id,
      merchantId: c.merchantId,
      email: c.email,
      name: c.name,
      phone: c.phone,
      country: c.country,
      company: c.company,
      tags: c.tags,
      totalSpent: c.totalSpent,
      txCount: c.txCount,
      avgOrderValue: c.avgOrderValue,
      ltv: c.ltv,
      churnRisk: c.churnRisk,
      churnRiskLabel: churnRiskLabel(c.churnRisk),
      daysSinceLastSeen: Math.floor(
        (Date.now() - c.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24),
      ),
      firstSeenAt: c.firstSeenAt.toISOString(),
      lastSeenAt: c.lastSeenAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      source: 'database',
      count: formatted.length,
      filters: {
        merchantId: merchantIdFilter || null,
        search: searchQuery || null,
      },
      customers: formatted,
      summary: {
        totalCustomers: dbCustomers.length,
        filteredCount: formatted.length,
        totalLtv: formatted.reduce((sum, c) => sum + c.ltv, 0),
        avgLtv:
          formatted.length > 0
            ? Math.round(formatted.reduce((sum, c) => sum + c.ltv, 0) / formatted.length)
            : 0,
        totalSpent: formatted.reduce((sum, c) => sum + c.totalSpent, 0),
        avgChurnRisk:
          formatted.length > 0
            ? Math.round((formatted.reduce((sum, c) => sum + c.churnRisk, 0) / formatted.length) * 100) / 100
            : 0,
        byRiskLevel: {
          low: formatted.filter(c => c.churnRisk < 0.2).length,
          medium: formatted.filter(c => c.churnRisk >= 0.2 && c.churnRisk < 0.5).length,
          high: formatted.filter(c => c.churnRisk >= 0.5 && c.churnRisk < 0.8).length,
          critical: formatted.filter(c => c.churnRisk >= 0.8).length,
        },
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Customers API] Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers', details: message }, { status: 500 })
  }
}
