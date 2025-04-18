import { updateDeposits } from '@/modules/cashier/action'
import { payPalConfig } from '@/modules/cashier/settings'
import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken } from '../getAccessToken'

export async function POST(req: NextRequest) {
    console.log('check status worked')

    const { id: orderId } = await req.json()

    if (!orderId) {
        return NextResponse.json(
            { error: 'Missing PayPal Order ID' },
            { status: 400 }
        )
    }

    let PAYPAL_API_URL = payPalConfig.PAYPAL_LIVE_API_URL

    if (payPalConfig.sandbox) {
        PAYPAL_API_URL = payPalConfig.PAYPAL_SANDBOX_API_URL
    }

    const access_token = await getAccessToken()

    try {
        // Send POST request to capture the payment
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

        console.log('check status working fine')

        const captureData = await captureRes.json()

        // Pull out the capture ID and status
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

        console.log('capture res', res)

        if (res.completed) {
            await updateDeposits({ transactionCode: orderId })
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
