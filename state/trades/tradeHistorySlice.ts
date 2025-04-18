import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// const buy = {
//   buy_price: 0,
//   contract_id: 0,
//   longcode: 0,
//   payout: 0,
//   transaction_id: 0,
// };

// const sell = {
//   buy_price: 0,
//   contract_id: 0,
//   longcode: 0,
//   payout: 0,
//   contract_type: "",
//   exit_tick: 142.8,
//   status: "won",
//   profit: 0,
//   tick_count: 0,
//   underlying: "R_100",
//   display_name: "Volatility 100 Index",
// };
type StatusT = 'Pending' | 'Lost' | 'Won'
export type DerivTradeState = {
    buy_price: number
    sell_price: number
    asset: string
    contract_type: string
    contract_id: number
    longcode: number
    entry_tick: string
    exit_tick: string
    payout: number
    profit: number
    status: StatusT
    date_expiry: number
    loginid: string
    is_virtual_hook: boolean
}

const initialState: DerivTradeState[] = [
    {
        buy_price: 0,
        sell_price: 0,
        asset: '1',
        contract_type: '2',
        contract_id: 3,
        longcode: 4,
        entry_tick: '#',
        exit_tick: '##',
        payout: 5,
        profit: 6,
        status: 'Pending' as StatusT,
        date_expiry: 17,
        loginid: '###',
        is_virtual_hook: false,
    },
]

const tradeHistorySlice = createSlice({
    name: 'trade_history',
    initialState,
    reducers: {
        openTrade: (state, action: PayloadAction<DerivTradeState>) => {
            // state = action.payload;
            const newTrades = [action.payload, ...state]
            return newTrades
        },
        updateTrade: (
            state,
            action: PayloadAction<{
                asset: string
                sell_price: number
                contract_type: string
                contract_id: number
                entry_tick: string
                date_expiry: number
            }>
        ) => {
            const {
                asset,
                sell_price,
                contract_id,
                contract_type,
                entry_tick,
                date_expiry,
            } = action.payload

            const updatedTrades = state.map(value => {
                if (value.contract_id === contract_id)
                    return {
                        buy_price: value.buy_price,
                        sell_price: sell_price,
                        asset: asset,
                        contract_type,
                        contract_id: value.contract_id,
                        longcode: value.longcode,
                        entry_tick,
                        exit_tick: value.exit_tick,
                        payout: value.payout,
                        profit: value.profit,
                        status: value.status,
                        date_expiry,
                        loginid: value.loginid,
                        is_virtual_hook: value.is_virtual_hook,
                    }

                return value
            })
            return updatedTrades
        },
        closeTrade: (
            state,
            action: PayloadAction<{
                status: string
                sell_price: number
                contract_id: number
                payout: number
                profit: number
                exit_tick: string
                date_expiry: number
            }>
        ) => {
            const { sell_price, contract_id, exit_tick, date_expiry } =
                action.payload
            const status: StatusT =
                action.payload.status === 'won' ? 'Won' : 'Lost'
            const payout =
                action.payload.status === 'won' ? action.payload.payout : 0
            const profit =
                action.payload.status === 'won' ? action.payload.profit : 0

            const closedTrades = state.map(value => {
                if (value.contract_id === contract_id)
                    return {
                        buy_price: value.buy_price,
                        sell_price,
                        asset: value.asset,
                        contract_type: value.contract_type,
                        contract_id: value.contract_id,
                        longcode: value.longcode,
                        entry_tick: value.entry_tick,
                        exit_tick: exit_tick,
                        payout: payout,
                        profit: profit,
                        status: status,
                        date_expiry,
                        loginid: value.loginid,
                        is_virtual_hook: value.is_virtual_hook,
                    }
                return value
            })
            return closedTrades
        },

        closeTradeTransaction: (
            state,
            action: PayloadAction<{
                asset: string
                status: string
                sell_price: number
                contract_id: number
                payout: number
                entry_tick: string
                exit_tick: string
                date_expiry: number
            }>
        ) => {
            const {
                sell_price,
                contract_id,
                entry_tick,
                exit_tick,
                date_expiry,
            } = action.payload
            const status: StatusT =
                action.payload.status === 'won' ? 'Won' : 'Lost'
            const payout =
                action.payload.status === 'won' ? action.payload.payout : 0

            const closedTrades = state.map(value => {
                if (value.contract_id === contract_id)
                    return {
                        buy_price: value.buy_price,
                        sell_price,
                        asset: action.payload.asset,
                        contract_type: value.contract_type,
                        contract_id: value.contract_id,
                        longcode: value.longcode,
                        entry_tick:
                            entry_tick === '#' ? entry_tick : value.entry_tick,
                        exit_tick:
                            exit_tick === '##' ? exit_tick : value.exit_tick,
                        payout: payout,
                        profit: payout - value.buy_price,
                        status: status,
                        date_expiry,
                        loginid: value.loginid,
                        is_virtual_hook: value.is_virtual_hook,
                    }
                return value
            })
            return closedTrades
        },

        upateEntryTick: (
            state,
            action: PayloadAction<{
                contract_id: number
                entry_tick: string
            }>
        ) => {
            const { contract_id, entry_tick } = action.payload

            const closedTrades = state.map(value => {
                if (value.contract_id === contract_id)
                    return {
                        buy_price: value.buy_price,
                        sell_price: value.sell_price,
                        asset: value.asset,
                        contract_type: value.contract_type,
                        contract_id: value.contract_id,
                        longcode: value.longcode,
                        entry_tick: entry_tick,
                        exit_tick: value.exit_tick,
                        payout: value.payout,
                        profit: value.profit,
                        status: value.status,
                        date_expiry: value.date_expiry,
                        loginid: value.loginid,
                        is_virtual_hook: value.is_virtual_hook,
                    }
                return value
            })
            return closedTrades
        },

        upateExitTick: (
            state,
            action: PayloadAction<{
                contract_id: number
                exit_tick: string
            }>
        ) => {
            const { contract_id, exit_tick } = action.payload

            const closedTrades = state.map(value => {
                if (value.contract_id === contract_id)
                    return {
                        buy_price: value.buy_price,
                        sell_price: value.sell_price,
                        asset: value.asset,
                        contract_type: value.contract_type,
                        contract_id: value.contract_id,
                        longcode: value.longcode,
                        entry_tick: value.entry_tick,
                        exit_tick: exit_tick,
                        payout: value.payout,
                        profit: value.profit,
                        status: value.status,
                        date_expiry: value.date_expiry,
                        loginid: value.loginid,
                        is_virtual_hook: value.is_virtual_hook,
                    }
                return value
            })
            return closedTrades
        },

        deleteTradeHistory: state => {
            // state = action.payload;
            return initialState
        },
    },
})

export const {
    openTrade,
    updateTrade,
    upateEntryTick,
    upateExitTick,
    closeTrade,
    closeTradeTransaction,
    deleteTradeHistory,
} = tradeHistorySlice.actions
export const tradeHistoryReducer = tradeHistorySlice.reducer
