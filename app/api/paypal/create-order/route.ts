import { NextResponse } from 'next/server'
import axios from 'axios'
import { payPalConfig } from '@/modules/cashier/settings'
import { updatePaypalTransactionDeposit } from '@/modules/cashier/action'

export async function POST(req: Request) {
    let PAYPAL_API_URL = payPalConfig.PAYPAL_LIVE_API_URL
    let PAYPAL_CLIENT_ID = payPalConfig.PAYPAL_LIVE_CLIENT_ID
    let PAYPAL_SECRET = payPalConfig.PAYPAL_LIVE_SECRET

    if (payPalConfig.sandbox) {
        PAYPAL_API_URL = payPalConfig.PAYPAL_SANDBOX_API_URL
        PAYPAL_CLIENT_ID = payPalConfig.PAYPAL_SANDBOX_CLIENT_ID
        PAYPAL_SECRET = payPalConfig.PAYPAL_SANDBOX_SECRET
    }

    try {
        const { amount, transactionCode } = await req.json() // Get amount from frontend

        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            )
        }

        const res = await axios.post(
            `${PAYPAL_API_URL}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: amount.toFixed(2),
                        }, // Pass amount
                        custom_id: transactionCode,
                    },
                ],
                application_context: {
                    return_url: payPalConfig.return_url,
                    cancel_url: payPalConfig.cancel_url,
                    // notification_url: payPalConfig.notify_url,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(
                        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
                    ).toString('base64')}`,
                },
            }
        )

        await updatePaypalTransactionDeposit({
            transactionCode: transactionCode,
            paypalTransactionCode: res.data.id,
        })

        console.log('PayPal Order Created:', res.data)

        return NextResponse.json(res.data)
    } catch (error: any) {
        console.error(
            'PayPal Order Error:',
            error.response?.data || error.message
        )
        return NextResponse.json(
            { error: 'Order creation failed' },
            { status: 500 }
        )
    }
}
