'use client'

import { useLocalStorageWithExpiry } from '@/hooks/useLocalStorageWithExpiry'
import { useEffect } from 'react'

export const usePayPalStatusSender = (token: string | null) => {
    const { value: transactionId } = useLocalStorageWithExpiry('paypal_id')

    useEffect(() => {
        const sendToWebhook = async () => {
            console.log('🧪 Token:', token)
            console.log('🧪 PayPal Transaction ID:', transactionId)

            if (!transactionId || !token) return

            try {
                const response = await fetch('/api/paypal/check-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: transactionId,
                        token: token,
                    }),
                })

                const data = await response.json()

                if (data.completed) {
                    console.log('✅ PayPal capture completed. Emails sent.')
                    localStorage.removeItem('paypal_id') // clear to avoid duplicates
                } else {
                    console.warn('⚠️ PayPal capture NOT completed:', data)
                }
            } catch (error) {
                console.error('❌ Error sending to webhook:', error)
            }
        }

        sendToWebhook()
    }, [transactionId, token])
}
