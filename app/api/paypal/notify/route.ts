import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    console.log('notification worked')

    try {
        // Parse incoming form data
        const formData = await req.formData()
        const paymentData: Record<string, string> = {}
        formData.forEach((value, key) => {
            paymentData[key] = value as string
        })

        // Log the payment notification data (For debugging)
        console.log('PayFast IPN Data:', paymentData)

        // Validate required fields
        if (!paymentData.payment_status || !paymentData.amount_gross) {
            return NextResponse.json(
                { success: false, message: 'Invalid PayFast data' },
                { status: 400 }
            )
        }

        // Process the payment notification (Store in DB, update order, etc.)
        // Example: Mark order as paid if payment_status === "COMPLETE"

        return NextResponse.json({
            success: true,
            message: 'Payment notification received',
        })
    } catch (error) {
        console.error('PayFast IPN Error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
