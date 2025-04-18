import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type CounterState = {
    value: number
}

const initialState: CounterState = {
    value: 0,
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        tradeIncrement: state => {
            state.value += 1
        },
        tradeDecrement: state => {
            state.value -= 1
        },
    },
})

export const { tradeIncrement, tradeDecrement } = counterSlice.actions
export const counterReducer = counterSlice.reducer
