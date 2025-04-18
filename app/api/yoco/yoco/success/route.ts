// File: /api/yoco/yoco/success/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/modules/db'
import { sendPaymentEmail } from '@/modules/mailer/sendPaymentNotification'
import { paymentAgentsSettings } from '@/modules/cashier/settings'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const transactionCode = searchParams.get('transaction')
    const token = searchParams.get('token')

    const rootUrl = paymentAgentsSettings.rootUrl

    if (!transactionCode || !token) {
        return NextResponse.redirect(`${rootUrl}/cashier?status=invalid`)
    }

    const deposit = await prisma.deposits.findFirst({
        where: { transactionCode },
    })

    if (!deposit || !deposit.isPaid) {
        return NextResponse.redirect(`${rootUrl}/cashier?status=unpaid`)
    }

    await sendPaymentEmail({
        subject: '🎉 Deposit Confirmation – Thank You!',
        token,
        to: deposit.email, // ✅ This sends to the customer
        data: {
            ...deposit,
            amountPaidInUsd: Number(deposit.amountPaidInUsd),
            agentFeeInUsd: Number(deposit.agentFeeInUsd),
            amountAfterFeeInUsd: Number(deposit.amountAfterFeeInUsd),
        },
    })

    return NextResponse.redirect(
        `${rootUrl}/cashier?token=${token}&status=confirmed`
    )
}
