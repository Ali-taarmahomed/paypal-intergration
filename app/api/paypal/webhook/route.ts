import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    console.log('webhook worked')
    try {
        const body = await req.json()
        console.log('PayPal Webhook Event:', body)

        if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            console.log('Payment Captured for Order ID:', body.resource.id)
        }

        return NextResponse.json({ status: 'Webhook Received' })
    } catch (error) {
        console.error('Webhook Error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
