import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const ENTITY_INFO: Record<string, string> = {
  FR: 'Sergio Monteiro (EI) — SIREN 790 155 006',
  BR: 'IAHUB BRASIL TECNOLOGIA LTDA — CNPJ 57.010.344/0001-90',
  UK: 'IAHUB360 LTD — Company #16568194',
  EU: 'Adyen N.V. — EU Payment Institution',
}

function buildComplianceText(jurisdiction: string): string {
  const entity = ENTITY_INFO[jurisdiction] || ENTITY_INFO.FR
  return `Powered by Atlas Global Core. Transactions processed by ${entity}. Atlas operates solely as a Technical Service Provider.`
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    const where: any = {}
    if (email) where.user = { email }

    const storefronts = await db.storefront.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ storefronts })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, slug, products, jurisdiction } = body

    if (!email || !name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    const resolvedJurisdiction = jurisdiction || 'FR'

    const user = await db.user.upsert({
      where: { email },
      create: { email },
      update: {},
    })

    const storefront = await db.storefront.create({
      data: {
        userId: user.id,
        name,
        slug,
        products: products ? JSON.parse(typeof products === 'string' ? products : JSON.stringify(products)) : [],
        jurisdiction: resolvedJurisdiction,
        complianceText: buildComplianceText(resolvedJurisdiction),
        status: 'draft',
      },
    })

    return NextResponse.json({ success: true, storefront })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
