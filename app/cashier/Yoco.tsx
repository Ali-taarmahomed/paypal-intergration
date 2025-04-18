'use client'

import { useState } from 'react'
import { createYocoCheckout } from '@/modules/cashier/action'

type YocoProps = {
    email: string
    loginid: string
    fullName: string
    amountPaidInUsd: number
    amountInZar: number
    transactionCode: string
    token: string
}

export default function Yoco({
    email,
    loginid,
    fullName,
    amountPaidInUsd,
    amountInZar,
    transactionCode,
    token,
}: YocoProps) {
    const [loading, setLoading] = useState(false)

    const handleYocoPayment = async () => {
        if (loading) return // 🛡️ prevent double-clicks
        setLoading(true)

        try {
            const response = await createYocoCheckout({
                email,
                loginId: loginid,
                fullName,
                amountPaidInUsd,
                amountInZar,
                transactionCode,
                token,
            })

            if (response?.redirectUrl) {
                window.location.href = response.redirectUrl
            } else {
                alert('Unable to start payment. Please try again.')
            }
        } catch (error) {
            console.error('Yoco Payment Error:', error)
            alert('Something went wrong. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <button
                type='button' // ✅ prevent accidental form submission
                onClick={handleYocoPayment}
                className='w-full rounded-lg bg-goldAli px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    )
}
