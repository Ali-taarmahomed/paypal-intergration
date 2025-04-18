'use client'
import { generateSignature } from '@/lib/signature'
import { payFastConfig } from '@/modules/cashier/settings'
import { useState } from 'react'

export const paymentMethods = {
    EFT: 'ef',
    'Credit card': 'cc',
    'Debit card': 'dc',
    'Masterpass Scan to Pay': 'mp',
    Mobicred: 'mc',
    SCode: 'sc',
    SnapScan: 'ss',
    Zapper: 'zp',
    MoreTyme: 'mt',
    'Store card': 'rc',
    Mukuru: 'mu',
    'Apple Pay': 'ap',
    'Samsung Pay': 'sp',
    'Capitec Pay': 'cp',
}

type PaymentData = Record<string, string>

export default function Payfast({
    email,
    loginId,
    fullName,
    amountPaidInUsd,
    transactionCode,
    payment_method,
    token,
}: {
    email: string
    loginId: string
    fullName: string
    amountPaidInUsd: number
    transactionCode: string
    payment_method: string
    token: string
}) {
    const currentTimeStamp = Date.now()
    const [formData, setFormData] = useState<PaymentData>({
        merchant_id: payFastConfig.merchant_id,
        merchant_key: payFastConfig.merchant_key,
        return_url: `${payFastConfig.return_url}?token=${token}`,
        cancel_url: `${payFastConfig.cancel_url}?token=${token}`,
        notify_url: `${payFastConfig.notify_url}?token=${token}`,
        name_first: fullName,
        name_last: fullName,
        email_address: email,
        m_payment_id: transactionCode,
        amount: String(amountPaidInUsd),
        item_name: `Deposit:${amountPaidInUsd}${transactionCode}`,
        payment_method: payment_method,
    })

    // formData['signature'] = generateSignature(formData)
    const payFastReqUrl = payFastConfig.testingMode
        ? payFastConfig.sandbox_url
        : payFastConfig.live_url

    return (
        <form
            action={payFastReqUrl}
            method='post'
            className='flex items-center justify-center'
        >
            {Object.keys(formData).map(key => (
                <input
                    key={key}
                    type='hidden'
                    name={key}
                    value={formData[key]}
                    required
                />
            ))}
            <button
                type='submit'
                onClick={async () => {}}
                className='w-full rounded-lg bg-goldAli px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
            >
                Pay Now
            </button>
        </form>
    )
}
