import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type DerivAccountsState = {
    code: string
    token: string
    isLive: boolean
    currency: string
}

const initialState: Record<string, DerivAccountsState> = {
    0: {
        code: '',
        token: '',
        isLive: false,
        currency: 'USD',
    },
}
export const userAccountsPersistKeys = (() => {
    const keys: string[] = []
    for (let i = 0; i < 15; i++) {
        keys.push(String(i))
    }
    return keys
})()

const userAccountsSlice = createSlice({
    name: 'user_accounts',
    initialState,
    reducers: {
        saveAccounts: (state, action: PayloadAction<DerivAccountsState[]>) => {
            const newAccounts = [...action.payload]
            const accounts: any = {}

            const accLen = newAccounts.length

            for (let i = 0; i < accLen; i++) {
                accounts[String(i)] = newAccounts[i]
            }
            return accounts
        },
        updateAccounts: (state, action: PayloadAction<DerivAccountsState>) => {
            const newAccount = action.payload
            const newKeys = Object.keys(state)

            const newObj = { ...state }

            for (let i = 0; i < newKeys.length; i++) {
                if (state[newKeys[i]].token === newAccount.token) {
                    newObj[newKeys[i]] = newAccount
                    break
                }
            }

            return newObj
        },
        deleteAccounts: state => {
            return initialState
        },
    },
})

export const { saveAccounts, updateAccounts, deleteAccounts } =
    userAccountsSlice.actions
export const userAccountsReducer = userAccountsSlice.reducer
