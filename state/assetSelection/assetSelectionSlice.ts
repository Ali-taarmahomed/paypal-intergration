import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type assetSelectionState = {
    name: string
    symbol: string
}

const initialState: assetSelectionState = {
    name: 'volatility_100',
    symbol: 'R_100',
}

const assetSelectionSlice = createSlice({
    name: 'asset_selection',
    initialState,
    reducers: {
        changeAsset: (state, action: PayloadAction<assetSelectionState>) => {
            state = action.payload
            return action.payload
        },
    },
})

export const { changeAsset } = assetSelectionSlice.actions
export const assetSelectionReducer = assetSelectionSlice.reducer
