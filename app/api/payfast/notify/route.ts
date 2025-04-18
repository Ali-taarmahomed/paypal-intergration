import { verifySignature } from '@/lib/signature'
import { updateDeposits } from '@/modules/cashier/action'
import { payFastConfig } from '@/modules/cashier/settings'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const payload = await req.json()

        // Extract signature
        // const { signature, ...otherData } = payload

        const { ...otherData } = payload

        console.log('Payload')
        console.table(payload)
        console.log(payload)

        const dataToVerify = {
            merchant_id: otherData.merchant_id,
            merchant_key: payFastConfig.merchant_key,
            return_url: payFastConfig.return_url,
            cancel_url: payFastConfig.cancel_url,
            notify_url: payFastConfig.notify_url,
            name_first: otherData.name_first,
            name_last: otherData.name_last,
            email_address: otherData.email_address,
            m_payment_id: otherData.m_payment_id,
            amount: otherData.amount_gross,
            item_name: otherData.item_name,
        }

        const transactionCode = dataToVerify.m_payment_id
        const grossAmount = otherData.amount_gross

        // // Verify signature
        // const isValid = verifySignature(dataToVerify, signature)

        // if (!isValid) {
        //     return NextResponse.json(
        //         { error: 'Invalid signature' },
        //         { status: 400 }
        //     )
        // }

        // Process payment status
        if (payload.payment_status === 'COMPLETE') {
            // Handle successful payment (e.g., update database)
            await updateDeposits({ transactionCode })
            return NextResponse.json(
                { success: true, message: 'Payment verified' },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { error: 'Payment not complete' },
            { status: 400 }
        )
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}
