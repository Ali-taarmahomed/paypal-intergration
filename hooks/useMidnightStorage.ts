'use client'
import { useState, useEffect } from 'react'

const getMidnightTimestamp = (): number => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(23, 59, 59, 999) // Set expiry time to 11:59:59 PM
    return midnight.getTime()
}

export function useMidnightStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T | null>(() => {
        if (
            typeof window === 'undefined' ||
            typeof window.localStorage === 'undefined'
        )
            return initialValue

        try {
            const item = window.localStorage.getItem(key)
            if (!item) return initialValue

            const { value, expiry } = JSON.parse(item)
            return expiry > Date.now() ? value : false
        } catch (error) {
            console.error('Error reading localStorage:', error)
            return initialValue
        }
    })

    useEffect(() => {
        if (typeof window === 'undefined') return

        const expiry = getMidnightTimestamp()
        window.localStorage.setItem(
            key,
            JSON.stringify({ value: storedValue, expiry })
        )
    }, [storedValue, key])

    return { storedValue, setStoredValue } as const
}
