import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type PayoutT = { stake: number; payout: number }

export type ContractPayoutsSliceState = {
    digitMatch: PayoutT
    digitDiff: PayoutT
    digitOver: PayoutT
    digitUnder: PayoutT
    digitEven: PayoutT
    digitOdd: PayoutT
    rise: PayoutT
    fall: PayoutT
}

const initialState: ContractPayoutsSliceState = {
    digitMatch: { stake: 0, payout: 0 },
    digitDiff: { stake: 0, payout: 0 },
    digitOver: { stake: 0, payout: 0 },
    digitUnder: { stake: 0, payout: 0 },
    digitEven: { stake: 0, payout: 0 },
    digitOdd: { stake: 0, payout: 0 },
    rise: { stake: 0, payout: 0 },
    fall: { stake: 0, payout: 0 },
}

const ContractPayoutsSliceSlice = createSlice({
    name: 'Contract_Payouts',
    initialState,
    reducers: {
        setPayout: (
            state,
            action: PayloadAction<{
                stake: number
                payout: number
                market: string
                prediction: number
            }>
        ) => {
            const { stake, payout, market, prediction } = action.payload

            switch (market) {
                case 'digitMatch':
                    return { ...state, digitMatch: { stake, payout } }
                case 'digitDiff':
                    return { ...state, digitDiff: { stake, payout } }
                case 'digitOver':
                    return { ...state, digitOver: { stake, payout } }
                case 'digitUnder':
                    return { ...state, digitUnder: { stake, payout } }
                case 'digitEven':
                    return { ...state, digitEven: { stake, payout } }
                case 'digitOdd':
                    return { ...state, digitOdd: { stake, payout } }
                case 'rise':
                    return { ...state, rise: { stake, payout } }
                case 'fall':
                    return { ...state, fall: { stake, payout } }
                default:
                    break
            }
            return { ...state }
        },
    },
})

export const { setPayout } = ContractPayoutsSliceSlice.actions
export const ContractPayoutsReducer = ContractPayoutsSliceSlice.reducer
