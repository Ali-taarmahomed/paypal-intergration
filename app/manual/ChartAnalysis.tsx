'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { MyTradingView } from './LineChart/TradingView'
import Loader from '@/Loader/Loader'

export const ChartAnalysis = () => {
    const tickHistory = useSelector((state: RootState) => state.tickHistory)

    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    const ticks = tickHistory[selectedAsset.symbol]['history']

    const reversedTicks = [...ticks].reverse() //from latest to olderst
    const lessTicks = reversedTicks.slice(0, 10)

    if (lessTicks.length < 10) return <Loader />

    return (
        <div className='mb-44 w-full'>
            {/* <>{lessTicks[0]}</> */}

            <MyTradingView ticks={[...lessTicks].reverse()} />
        </div>
    )
}
