import { configureStore } from '@reduxjs/toolkit'
import { tickHistoryReducer } from './ticks/tickHistorySlice'
import { tradeHistoryReducer } from './trades/tradeHistorySlice'

import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { assetSelectionReducer } from './assetSelection/assetSelectionSlice'
import {
    userAccountsPersistKeys,
    userAccountsReducer,
} from './userAccounts/userAccountsSlice'
import {
    derivUserPersistKeys,
    derivUserReducer,
} from './derivUser/derivUserSlice'
import { counterReducer } from './counter/counterSlice'
import { accumulatorStatReducer } from './accumulatorStat/accumulatorStatSlice'
import { markupsReducer } from './markups/markupsSlice'
import { marketSelectionReducer } from './marketSelection/marketSelectionSlice'
import { ManualConfigurationReducer } from './ManualConfiguration/ManualConfigurationSlice'
import { ContractPayoutsReducer } from './ContractPayouts/ContractPayoutsSlice'
import { withdrawPersistKeys, withdrawReducer } from './withdraw/withdrawSlice'

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null)
        },
        setItem(_key: string, value: number) {
            return Promise.resolve(value)
        },
        removeItem() {
            return Promise.resolve()
        },
    }
}

const storage =
    typeof window !== 'undefined'
        ? createWebStorage('local')
        : createNoopStorage()

// withdraw
const withdrawPersistConfig = {
    key: 'withdraw',
    storage: storage,
    whitelist: withdrawPersistKeys,
}

const persistedReducerWithdraw = persistReducer(
    withdrawPersistConfig,
    withdrawReducer
)

// deriv user
const derivUserPersistConfig = {
    key: 'derivUser',
    storage: storage,
    whitelist: derivUserPersistKeys,
}

const persistedReducerDerivUser = persistReducer(
    derivUserPersistConfig,
    derivUserReducer
)

// switch accounts
const switchuserAccountsPersistConfig = {
    key: 'switchuserAccounts',
    storage: storage,
    whitelist: userAccountsPersistKeys,
}

const persistedReducerswitchuserAccounts = persistReducer(
    switchuserAccountsPersistConfig,
    userAccountsReducer
)

//end

export const store = configureStore({
    reducer: {
        withdrawData: persistedReducerWithdraw,
        ContractPayouts: ContractPayoutsReducer,
        ManualConfiguration: ManualConfigurationReducer,
        selectedMarket: marketSelectionReducer,
        tradeCount: counterReducer,
        tickHistory: tickHistoryReducer,
        trades: tradeHistoryReducer,
        assetSelection: assetSelectionReducer,
        derivUser: persistedReducerDerivUser,
        accounts: persistedReducerswitchuserAccounts,
        accumulatorStat: accumulatorStatReducer,
        markups: markupsReducer,
    },
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
    //         },
    //     }),

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
