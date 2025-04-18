'use client'

import { useLocalStorageWithExpiry } from '@/hooks/useLocalStorageWithExpiry'
import { useEffect } from 'react'

export const usePayPalStatusSender = () => {
    const { value: transactionId } = useLocalStorageWithExpiry('paypal_id')

    useEffect(() => {
        const sendToWebhook = async () => {
            if (!transactionId) return

            try {
                const response = await fetch('/api/paypal/check-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: transactionId }),
                })

                const data = await response.json()
                console.log('Transaction Status Response:', data)
            } catch (error) {
                console.error('Error sending to webhook:', error)
            }
        }

        sendToWebhook()
    }, [transactionId])
}
