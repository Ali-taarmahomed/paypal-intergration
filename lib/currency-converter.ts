'use client'
// import axios from 'axios'
// import { BrowserStore } from './browser-storage'

// Define the API endpoint and your API key (replace with your own)
// const API_KEY = '1669601f3e2cb5e36fc9c1f7' // Replace with your actual API key
// const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`

// https://v6.exchangerate-api.com/v6/1669601f3e2cb5e36fc9c1f7/latest/USD

export async function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
): Promise<number> {
    // const { set, get } = BrowserStore
    try {
        console.log({ amount, fromCurrency, toCurrency })
        return 1

        // const res = get(`${fromCurrency}-${toCurrency}`)

        // if (res !== null) {
        //     return parseFloat(res)
        // }

        // const response = await axios.get(`${API_URL}${fromCurrency}`)

        // // Get the conversion rate from the API response
        // const rates = response.data.conversion_rates
        // const conversionRate = rates[toCurrency]

        // if (!conversionRate) {
        //     throw new Error(`Conversion rate for ${toCurrency} not found`)
        // }

        // // Convert the amount
        // const convertedAmount = amount * conversionRate
        // set(`${fromCurrency}-${toCurrency}`, String(convertedAmount))
        // return convertedAmount
    } catch (error) {
        console.error('Error converting currency:', error)
        throw error
    }
}
