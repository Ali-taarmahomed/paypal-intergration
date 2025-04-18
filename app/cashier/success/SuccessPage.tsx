'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import Loader from '@/components/Loader'
import { FaCheckCircle } from 'react-icons/fa'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePayPalStatusSender } from '@/hooks/usePayPalStatusSender'
import { useLocalStorageWithExpiry } from '@/hooks/useLocalStorageWithExpiry' // ✅ import your hook

export const PaymentSuccessModal: React.FC = () => {
    usePayPalStatusSender()

    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(true)
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const token = searchParams.get('token')
    const transactionCode =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('lastTransactionCode')
            : null

    // ✅ Use your hook to fetch PayPal ID with expiry handling
    const { value: paypalOrderId } = useLocalStorageWithExpiry('paypal_id')

    const redirectToCashier = (token: string) => {
        router.push(`/cashier?token=${token}`)
    }

    // ✅ Yoco email logic — leave as-is
    useEffect(() => {
        const sendCustomerEmail = async () => {
            if (!token || !transactionCode) return

            try {
                const res = await fetch(
                    `/api/send-confirmation?transaction=${transactionCode}&token=${token}`
                )
                const data = await res.json()

                if (data.success) {
                    console.log('✅ Customer confirmation email sent')
                } else {
                    console.warn(
                        '⚠️ Failed to send customer email:',
                        data.error
                    )
                }
            } catch (error) {
                console.error('❌ Email sending error:', error)
            }
        }

        sendCustomerEmail()
    }, [token, transactionCode])

    // ✅ PayPal flow — uses capture + server-side email logic
    useEffect(() => {
        const sendPayPalStatus = async () => {
            console.log('🧪 TOKEN FROM URL:', token)
            console.log('🧪 PAYPAL ORDER ID from hook:', paypalOrderId)

            if (!paypalOrderId || !token) return

            try {
                const res = await fetch('/api/paypal/check-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: paypalOrderId,
                        token: token,
                    }),
                })

                const data = await res.json()

                if (data.completed) {
                    console.log('✅ PayPal status confirmed and emails sent')
                    localStorage.removeItem('paypal_id') // optional cleanup
                } else {
                    console.warn('⚠️ PayPal payment not completed:', data)
                }
            } catch (err) {
                console.error('❌ Failed to verify PayPal payment:', err)
            }
        }

        sendPayPalStatus()
    }, [paypalOrderId, token])

    useEffect(() => {
        setTimeout(() => {
            redirectToCashier(accountInfo.token)
        }, 5000)
    }, [])

    if (!isOpen || !token) return <Loader />
    if (accountInfo.token === '') return <Loader />

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50'>
            <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
                <div className='mb-4 flex justify-center'>
                    <FaCheckCircle className='text-6xl text-green-600' />
                </div>
                <h2 className='text-center text-2xl font-bold text-green-600'>
                    Payment Successful
                </h2>
                <p className='mt-2 text-center text-gray-600'>
                    Your payment was successful! You can now proceed to the
                    cashier.
                </p>
                <div className='mt-4 flex justify-center gap-4'>
                    <button
                        onClick={() => redirectToCashier(accountInfo.token)}
                        className='rounded-md bg-green-500 px-4 py-2 text-white'
                    >
                        Go to Cashier
                    </button>
                </div>
            </div>
        </div>
    )
}
