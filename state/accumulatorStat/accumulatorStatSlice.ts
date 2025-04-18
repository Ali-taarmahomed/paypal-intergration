import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { derivAssetsArr } from '../ticks/tickHistorySlice'

export type ProposalT = {
    ticks_stayed_in: number[]
    high_barrier: string
    low_barrier: string
    max_stake: string
    minStake: string
    percent: string
}

export const initialState: Record<string, ProposalT> = (() => {
    const someObj: any = {}
    for (let item of derivAssetsArr) {
        for (let i = 1; i <= 5; i++) {
            someObj[`${item.symbol}_${i}`] = {
                ticks_stayed_in: [],
                high_barrier: 'null',
                low_barrier: 'null',
                max_stake: 'null',
                minStake: 'null',
                percent: 'null',
            }
        }

        // someObj[`${item.symbol}`] = {
        //     ticks_stayed_in: [],
        //     high_barrier: 'null',
        //     low_barrier: 'null',
        //     max_stake: 'null',
        //     minStake: 'null',
        //     percent: 'null',
        // }
    }

    return someObj
})()

const accumulatorStatSlice = createSlice({
    name: 'trade_history',
    initialState,
    reducers: {
        saveStat: (
            state,
            action: PayloadAction<{ asset: string; data: ProposalT }>
        ) => {
            const { asset, data } = action.payload
            const asset_percentage = `${asset}_${data.percent}`
            // initial data
            state[asset_percentage].high_barrier = data.high_barrier
            state[asset_percentage].low_barrier = data.low_barrier
            state[asset_percentage].max_stake = data.max_stake
            state[asset_percentage].minStake = data.minStake
            state[asset_percentage].ticks_stayed_in = (() => {
                const stateTicks = [...state[asset_percentage].ticks_stayed_in]
                if (
                    state[asset_percentage].ticks_stayed_in.length === 0 ||
                    data.ticks_stayed_in.length > 1
                )
                    return data.ticks_stayed_in

                if (data.ticks_stayed_in[0] === 0) {
                    stateTicks.push(data.ticks_stayed_in[0])
                } else {
                    stateTicks[stateTicks.length - 1] = data.ticks_stayed_in[0]
                }
                return stateTicks
            })()

            return state
        },
    },
})

export const { saveStat } = accumulatorStatSlice.actions
export const accumulatorStatReducer = accumulatorStatSlice.reducer
