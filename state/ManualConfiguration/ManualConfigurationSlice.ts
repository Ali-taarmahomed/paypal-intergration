import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type ManualConfigurationState = {
    stake: number
    duration: number
    durationUnit: string
    prediction: number
    positiveBarrier: string
    negativeBarrier: string
    selectedTick: number
}

const initialState: ManualConfigurationState = {
    stake: 1,
    duration: 1,
    durationUnit: 't',
    prediction: 1,
    positiveBarrier: '+0.0',
    negativeBarrier: '+0.0',
    selectedTick: 1,
}

const ManualConfigurationSlice = createSlice({
    name: 'Manual_Configuration',
    initialState,
    reducers: {
        setStake: (state, action: PayloadAction<number>) => {
            return { ...state, stake: action.payload }
        },
        setDuration: (
            state,
            action: PayloadAction<{ duration: number; durationUnit: string }>
        ) => {
            const { duration, durationUnit } = action.payload
            return { ...state, duration, durationUnit }
        },
        setPrediction: (state, action: PayloadAction<number>) => {
            return { ...state, prediction: action.payload }
        },
    },
})

export const { setStake, setDuration, setPrediction } =
    ManualConfigurationSlice.actions
export const ManualConfigurationReducer = ManualConfigurationSlice.reducer
