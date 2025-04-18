// File: /api/yoco/yoco/route.ts

import { NextResponse } from 'next/server'
import { updateDeposits } from '@/modules/cashier/action'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        console.log('🎯 Webhook Body:', body)

        const transactionCode = body?.payload?.metadata?.transactionCode

        if (transactionCode) {
            console.log('✅ Yoco webhook matched:', transactionCode)
            await updateDeposits({ transactionCode })
        } else {
            console.warn('⚠️ Missing transactionCode in webhook payload')
        }

        return NextResponse.json({ status: 'ok' })
    } catch (err) {
        console.error('❌ Yoco webhook error:', err)
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
    }
}
