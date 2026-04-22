import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, companyName, registrationNumber, directorName, directorId, country, taxId, jurisdiction, capitalSocial } = body

    if (!email || !companyName || !registrationNumber || !directorName || !directorId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const resolvedCountry = country || 'FR'
    const resolvedJurisdiction = jurisdiction || resolvedCountry

    // Trust Signal for Brazil Hub: auto-set capital social if BR
    const resolvedCapitalSocial = capitalSocial || (resolvedJurisdiction === 'BR' ? 'R$200000.00' : null)

    const user = await db.user.upsert({
      where: { email },
      create: { email, name: directorName, role: 'merchant' },
      update: { name: directorName, role: 'merchant' },
    })

    const kyb = await db.merchantKyb.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        companyName,
        registrationNumber,
        taxId: taxId || null,
        directorName,
        directorId,
        country: resolvedCountry,
        jurisdiction: resolvedJurisdiction,
        capitalSocial: resolvedCapitalSocial,
        status: 'pending',
      },
      update: {
        companyName,
        registrationNumber,
        taxId: taxId || null,
        directorName,
        directorId,
        country: resolvedCountry,
        jurisdiction: resolvedJurisdiction,
        capitalSocial: resolvedCapitalSocial,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, kybId: kyb.id, status: kyb.status })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const kyb = await db.merchantKyb.findFirst({
      where: { user: { email } },
      include: { user: true },
    })

    if (!kyb) {
      return NextResponse.json({ found: false, status: 'none' })
    }

    return NextResponse.json({ found: true, ...kyb })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
