'use client'

import { useLocalStorageWithExpiry } from '@/hooks/useLocalStorageWithExpiry'
import axios from 'axios'
import { useState } from 'react'

export const PaypalForm = ({
    amount,
    itemId,
    transactionCode,
}: {
    amount: number
    itemId: string
    transactionCode: string
}) => {
    const [loading, setLoading] = useState(false)
    const { value, setItem } = useLocalStorageWithExpiry('paypal_id')

    const handleCheckout = async () => {
        setLoading(true)
        try {
            const res = await axios.post('/api/paypal/create-order', {
                amount: amount,
                transactionCode: transactionCode,
            })
            console.log('Order Created:', res.data)

            //save id to localStorage

            setItem(res.data.id)

            const approveUrl = res.data.links.find(
                (link: any) => link.rel === 'approve'
            )?.href

            if (approveUrl) {
                window.location.href = approveUrl
            } else {
                alert('Failed to get approval URL')
            }
        } catch (error: any) {
            console.error(
                'PayPal Checkout Error:',
                error.response?.data || error.message
            )
            alert('Error processing PayPal checkout')
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className='w-full rounded-lg bg-blue-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
        >
            {loading ? 'Redirecting...' : 'Pay Now'}
        </button>
    )
}
