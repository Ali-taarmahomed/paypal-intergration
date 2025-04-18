import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type AccountInfoState = {
    balance: number
    country: string
    currency: string
    email: string
    is_virtual: boolean
    is_virtual_hook: boolean
    loginid: string
    fullname: string
    user_id: number
    token: string
    isActivated: boolean
}

const initialState: AccountInfoState = {
    balance: 0,
    country: '',
    currency: 'USD',
    email: '',
    is_virtual: true,
    is_virtual_hook: false,
    loginid: '',
    fullname: '',
    user_id: 0,
    token: '',
    isActivated: true,
}

export const derivUserPersistKeys = Object.keys(initialState)

const derivUserSlice = createSlice({
    name: 'deriv_user',
    initialState,
    reducers: {
        updateUserData: (state, action: PayloadAction<AccountInfoState>) => {
            state = action.payload
            return action.payload
        },
        updateBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload
        },
    },
})

export const { updateUserData, updateBalance } = derivUserSlice.actions
export const derivUserReducer = derivUserSlice.reducer
