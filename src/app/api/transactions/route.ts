import { db } from '@/lib/db'
import { routeTransaction, type Region } from '@/lib/nexflowx'
import { NextRequest, NextResponse } from 'next/server'

const GATEWAYS = ['Stripe', 'Adyen', 'Viva', 'Cripto', 'TON']
const STATUSES = ['completed', 'pending', 'processing', 'failed']
const REGIONS: Region[] = ['EU', 'UK', 'BR']
const REGION_WEIGHTS = [0.50, 0.30, 0.20] // EU 50%, UK 30%, BR 20%

function pickRegion(): Region {
  const r = Math.random()
  if (r < REGION_WEIGHTS[0]) return 'EU'
  if (r < REGION_WEIGHTS[0] + REGION_WEIGHTS[1]) return 'UK'
  return 'BR'
}

function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'ATX-'
  for (let i = 0; i < 12; i++) result += chars.charAt(Math.floor(Math.random() * chars.length))
  return result
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const gateway = searchParams.get('gateway')
    const region = searchParams.get('region')

    const where: any = {}
    if (gateway) where.gateway = gateway
    if (region) where.region = region

    let transactions = await db.transaction.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    // Seed mock data if empty
    if (transactions.length === 0) {
      const mockData = []
      const merchants = ['TechVault SARL', 'NexusPay Ltd', 'CryptoBridge GmbH', 'Atlantic Commerce', 'DigitalForge Inc']
      const euCurrencies = ['EUR', 'USD', 'GBP', 'BTC', 'USDT']

      for (let i = 0; i < 25; i++) {
        const txRegion = pickRegion()
        const currency = txRegion === 'BR' ? 'BRL' : euCurrencies[Math.floor(Math.random() * euCurrencies.length)]
        const gw = GATEWAYS[Math.floor(Math.random() * GATEWAYS.length)]

        mockData.push({
          id: `mock-${i + 1}`,
          userId: 'system-seed',
          merchantName: merchants[Math.floor(Math.random() * merchants.length)],
          amount: parseFloat((Math.random() * 50000 + 100).toFixed(2)),
          currency,
          status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
          gateway: gw,
          gatewayStatus: Math.random() > 0.2 ? 'active' : 'inactive',
          routingEngine: 'NeXFlowX',
          reference: generateRef(),
          region: txRegion,
        })
      }
      await db.transaction.createMany({ data: mockData })
      transactions = await db.transaction.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ transactions, total: transactions.length })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, merchantName, amount, currency, region } = body

    if (!email || !merchantName || !amount) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    const resolvedRegion = (region || 'EU') as Region

    // Use NeXFlowX to determine the optimal gateway for this transaction
    const routing = routeTransaction({
      amount: parseFloat(amount),
      currency,
      region: resolvedRegion,
    })

    const user = await db.user.upsert({
      where: { email },
      create: { email },
      update: {},
    })

    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        merchantName,
        amount: parseFloat(amount),
        currency: routing.currency,
        gateway: routing.gateway,
        region: routing.region,
        reference: generateRef(),
        status: 'processing',
        metadata: {
          entityId: routing.entityId,
          entityName: routing.entityName,
          estimatedLatency: routing.estimatedLatency,
          fallbackGateway: routing.fallbackGateway,
        },
      },
    })

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
