'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useMidnightStorage } from './useMidnightStorage'

const API_KEY = '1669601f3e2cb5e36fc9c1f7' // Replace with your actual API key
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`

export const useCurrencyConverter = (from: string, to: string) => {
    if (
        typeof window === 'undefined' ||
        typeof window.localStorage === 'undefined'
    )
        return null
    const myKey = String(`${from}_${to}`)
    const initialValue = window.localStorage.getItem(myKey)
    const { storedValue, setStoredValue } = useMidnightStorage(
        myKey,
        parseFloat(String(initialValue == null ? 1 : initialValue))
    )

    useEffect(() => {
        const fn = async () => {
            const response = await axios.get(`${API_URL}${from}`)
            const rates = response.data.conversion_rates
            const conversionRate = rates[to]

            setStoredValue(Math.floor(conversionRate * 100) / 100)
        }

        fn()
        return () => {}
    }, [storedValue])

    return storedValue
}
