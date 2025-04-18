'use client'

import { useCallback, useEffect, useState } from 'react'

const EXPIRY_TIME = 15 * 60 * 1000 // 15 minutes

type StoredData = {
    value: string
    timestamp: number
}

export function useLocalStorageWithExpiry(key: string) {
    const [storedValue, setStoredValue] = useState<string | null>(null)

    // Get the item from localStorage on client side
    useEffect(() => {
        if (typeof window === 'undefined') return

        const item = localStorage.getItem(key)
        if (!item) return

        try {
            const data: StoredData = JSON.parse(item)
            const isExpired = Date.now() - data.timestamp > EXPIRY_TIME

            if (isExpired) {
                localStorage.removeItem(key)
                setStoredValue(null)
            } else {
                setStoredValue(data.value)
            }
        } catch (err) {
            console.error('Failed to parse localStorage item:', err)
            localStorage.removeItem(key)
        }
    }, [key])

    // Save item
    const setItem = useCallback(
        (value: string) => {
            const data: StoredData = {
                value,
                timestamp: Date.now(),
            }
            localStorage.setItem(key, JSON.stringify(data))
            setStoredValue(value)
        },
        [key]
    )

    return { value: storedValue, setItem }
}
