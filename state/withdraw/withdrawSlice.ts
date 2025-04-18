import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type WithdrawT = {
    amountInUSD: number
    paymentMethod: string
    loginid: string
    token: string
    email: string
    paymentagent_loginid: string
    timeStamp: number
}

const initialState: WithdrawT = {
    amountInUSD: 0,
    paymentMethod: '',
    loginid: '',
    token: '',
    email: '',
    paymentagent_loginid: '',
    timeStamp: 0,
}

export const withdrawPersistKeys = Object.keys(initialState)

const withdrawSlice = createSlice({
    name: 'withdraw_from_agent',
    initialState,
    reducers: {
        saveWithdrawData: (state, action: PayloadAction<WithdrawT>) => {
            return action.payload
        },
        resetWithdrawData: () => {
            return initialState
        },
    },
})

export const { saveWithdrawData, resetWithdrawData } = withdrawSlice.actions
export const withdrawReducer = withdrawSlice.reducer
