'use client'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { Helper } from '@/lib/derivAnalysis'
import React from 'react'

export const TickPrice = () => {
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )
    const tickHistory = useSelector((state: RootState) => state.tickHistory)
    const ticks = tickHistory[selectedAsset.symbol]['history']
    const reversedTicks = [...ticks].reverse() //from latest to olderst

    const price = Helper.includeTrailingZeros(reversedTicks)[0]
    return <span className='text-md text-center font-bold'>{price}</span>
}
