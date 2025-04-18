// File: app/api/send-confirmation/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/modules/db'
import { sendPaymentEmail } from '@/modules/mailer/sendPaymentNotification'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const transactionCode = searchParams.get('transaction')
    const token = searchParams.get('token')

    if (!transactionCode || !token) {
        return NextResponse.json(
            { error: 'Missing token or transaction code' },
            { status: 400 }
        )
    }

    const deposit = await prisma.deposits.findFirst({
        where: { transactionCode },
    })

    if (!deposit || !deposit.isPaid) {
        return NextResponse.json(
            { error: 'Not paid or not found' },
            { status: 404 }
        )
    }

    await sendPaymentEmail({
        subject: '🎉 Deposit Confirmation – Thank You!',
        token,
        to: deposit.email,
        data: {
            ...deposit,
            amountPaidInUsd: Number(deposit.amountPaidInUsd),
            agentFeeInUsd: Number(deposit.agentFeeInUsd),
            amountAfterFeeInUsd: Number(deposit.amountAfterFeeInUsd),
        },
    })

    return NextResponse.json({ success: true })
}
