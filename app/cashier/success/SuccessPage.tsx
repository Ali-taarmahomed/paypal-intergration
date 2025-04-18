'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import Loader from '@/components/Loader'
import { FaCheckCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useLocalStorageWithExpiry } from '@/hooks/useLocalStorageWithExpiry'

export const PaymentSuccessModal: React.FC = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(true)
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const token = accountInfo.token
    const transactionCode =
        typeof window !== 'undefined'
            ? sessionStorage.getItem('lastTransactionCode')
            : null

    const { value: paypalOrderId } = useLocalStorageWithExpiry('paypal_id')

    const redirectToCashier = (token: string) => {
        router.push(`/cashier?token=${token}`)
    }

    // ✅ Yoco confirmation email
    useEffect(() => {
        const sendCustomerEmail = async () => {
            if (!token || !transactionCode) return

            try {
                const res = await fetch(
                    `/api/send-confirmation?transaction=${transactionCode}&token=${token}`
                )

                const data = await res.json()

                if (data.success) {
                    console.log('✅ Yoco: Customer confirmation email sent')
                } else {
                    console.warn('⚠️ Yoco: Failed to send email:', data.error)
                }
            } catch (error) {
                console.error('❌ Yoco: Email sending error:', error)
            }
        }

        sendCustomerEmail()
    }, [token, transactionCode])

    // ✅ PayPal webhook + capture + email
    useEffect(() => {
        const sendPayPalStatus = async () => {
            if (!paypalOrderId || !token) return

            console.log('🧪 PayPal ID:', paypalOrderId)
            console.log('🧪 Token:', token)

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
                    console.log('✅ PayPal: Emails sent via webhook.')
                    localStorage.removeItem('paypal_id')
                } else {
                    console.warn('⚠️ PayPal: Payment not completed:', data)
                }
            } catch (err) {
                console.error('❌ PayPal: Verification error:', err)
            }
        }

        sendPayPalStatus()
    }, [paypalOrderId, token])

    // ✅ Redirect to /cashier with same token used in email
    useEffect(() => {
        setTimeout(() => {
            redirectToCashier(token)
        }, 5000)
    }, [token])

    if (!isOpen || !token) return <Loader />
    if (token === '') return <Loader />

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
                        onClick={() => redirectToCashier(token)}
                        className='rounded-md bg-green-500 px-4 py-2 text-white'
                    >
                        Go to Cashier
                    </button>
                </div>
            </div>
        </div>
    )
}
