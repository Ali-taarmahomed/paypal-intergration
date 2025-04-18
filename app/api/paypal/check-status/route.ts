import { updateDeposits } from '@/modules/cashier/action'
import { payPalConfig } from '@/modules/cashier/settings'
import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '../getAccessToken'
import { prisma } from '@/modules/db'
import { sendPaymentEmail } from '@/modules/mailer/sendPaymentNotification'

export async function POST(req: NextRequest) {
    console.log('✅ PayPal status check started')

    const { id: orderId, token } = await req.json()

    if (!orderId || !token) {
        return NextResponse.json(
            { error: 'Missing PayPal Order ID or Token' },
            { status: 400 }
        )
    }

    let PAYPAL_API_URL = payPalConfig.PAYPAL_LIVE_API_URL
    if (payPalConfig.sandbox) {
        PAYPAL_API_URL = payPalConfig.PAYPAL_SANDBOX_API_URL
    }

    const access_token = await getAccessToken()

    try {
        const captureRes = await fetch(
            `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!captureRes.ok) {
            const errorData = await captureRes.json()
            return NextResponse.json(
                { error: 'Capture failed', details: errorData },
                { status: captureRes.status }
            )
        }

        const captureData = await captureRes.json()
        const capture =
            captureData?.purchase_units?.[0]?.payments?.captures?.[0]
        const captureId = capture?.id
        const transactionStatus = capture?.status

        const res = {
            orderId,
            captureId,
            transactionStatus,
            completed: transactionStatus === 'COMPLETED',
            raw: captureData,
        }

        if (res.completed) {
            // ✅ Update deposit to mark as paid
            await updateDeposits({ transactionCode: orderId })

            // ✅ Now fetch the deposit
            const deposit = await prisma.deposits.findFirst({
                where: { transactionCode: orderId },
            })

            // ✅ Send customer email (after webhook confirms payment)
            if (deposit && deposit.isPaid) {
                await sendPaymentEmail({
                    subject: '🎉 Deposit Confirmation – Thank You!',
                    token,
                    to: deposit.email,
                    data: {
                        ...deposit,
                        amountPaidInUsd: Number(deposit.amountPaidInUsd),
                        agentFeeInUsd: Number(deposit.agentFeeInUsd),
                        amountAfterFeeInUsd: Number(
                            deposit.amountAfterFeeInUsd
                        ),
                    },
                })
            }
        }

        return NextResponse.json(res)
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to capture PayPal transaction',
                message: (error as Error).message,
            },
            { status: 500 }
        )
    }
}
