import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const allMarketCategories = [
    'Match/Differ',
    'Over/Under',
    'Even/Odd',
    'Rise/Fall',
]

const initialState: string = allMarketCategories[0]

const marketSelectionSlice = createSlice({
    name: 'market_selection',
    initialState,
    reducers: {
        setMarket: (state, action: PayloadAction<string>) => {
            state = action.payload
            return action.payload
        },
    },
})

export const { setMarket } = marketSelectionSlice.actions
export const marketSelectionReducer = marketSelectionSlice.reducer
