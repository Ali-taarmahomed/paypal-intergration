'use client'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'

export const useTradeSummary = () => {
    const trades = useSelector((state: RootState) => state.trades)

    const buyingPrice = trades
        .map(value => {
            if (value.status !== 'Pending' && !value.is_virtual_hook) {
                return value.buy_price
            }
            return 0
        })
        .reduce((acc, val) => acc + val, 0)
    const payout = trades
        .map(value => {
            if (value.status !== 'Pending' && !value.is_virtual_hook) {
                return value.payout
            }
            return 0
        })
        .reduce((acc, val) => acc + val, 0)

    const profit = payout - buyingPrice
    const wins = trades.filter(
        value => value.status === 'Won' && !value.is_virtual_hook
    ).length
    const loses = trades.filter(
        value => value.status === 'Lost' && !value.is_virtual_hook
    ).length
    const total = wins + loses

    const res = { profit, wins, loses, totalTrades: total }
    // console.log(res)

    return res
}
