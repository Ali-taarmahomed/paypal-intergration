import { PayloadAction, createSlice } from '@reduxjs/toolkit'
//assets
const assetNames = {
    R_10: 'volatility_10',
    R_25: 'volatility_25',
    R_50: 'volatility_50',
    R_75: 'volatility_75',
    R_100: 'volatility_100',
    '1HZ10V': 'volatility_10(1s)',
    '1HZ25V': 'volatility_25(1s)',
    '1HZ50V': 'volatility_50(1s)',
    '1HZ75V': 'volatility_75(1s)',
    '1HZ100V': 'volatility_100(1s)',
    /*JD10: 'jump_10',
    JD25: 'jump_25',
    JD50: 'jump_50',
    JD75: 'jump_75',
    JD100: 'jump_100',
    RDBULL: 'bull_market',
    RDBEAR: 'bear_market',
    BOOM300N: 'Boom 300 Index',
    CRASH300N: 'Crash 300 Index',
    BOOM500: 'Boom 500 Index',
    CRASH500: 'Crash 500 Index',
    BOOM1000: 'Boom 1000 Index',
    CRASH1000: 'Crash 1000 Index',
    frxEURAUD: 'EUR/AUD',
    frxEURCAD: 'EUR/CAD',
    frxEURCHF: 'EUR/CHF',
    frxEURGBP: 'EUR/GBP',
    frxEURJPY: 'EUR/JPY',
    frxEURNZD: 'EUR/NZD',
    frxEURUSD: 'EUR/USD',
    frxGBPCAD: 'GBP/CAD',
    frxAUDNZD: 'AUD/NZD',
    frxAUDJPY: 'AUD/JPY',
    frxAUDCHF: 'AUD/CHF',
    frxAUDCAD: 'AUD/CAD',
    frxXAUUSD: 'XAU/USD',
    cryETHUSD: 'ETH/USD',*/
}

export type AssetKeyT = typeof assetNames

export const derivAssetsArr = (() => {
    const keys = Object.keys(assetNames)
    const assetArr = []
    for (let item of keys) {
        assetArr.push({
            name: assetNames[item as keyof AssetKeyT],
            symbol: item,
        })
    }
    return assetArr
})()

// redux continue

export type DerivPriceState = {
    asset: string
    history: number[]
    time: number[]
}

export const defaultValues: Record<string, DerivPriceState> = (() => {
    const someObj: any = {}
    for (let item of derivAssetsArr) {
        someObj[item.symbol] = {
            asset: '',
            history: [0],
            time: [0],
        }
    }

    return someObj
})()

const initialState: Record<string, DerivPriceState> = defaultValues

const tickHistorySlice = createSlice({
    name: 'ticks_history',
    initialState,
    reducers: {
        initTicks: (
            state,
            action: PayloadAction<Record<string, DerivPriceState>>
        ) => {
            // state=action.payload
            return action.payload
        },
    },
})

export const { initTicks } = tickHistorySlice.actions
export const tickHistoryReducer = tickHistorySlice.reducer
