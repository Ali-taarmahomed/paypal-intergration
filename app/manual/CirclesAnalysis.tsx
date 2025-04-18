'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import { DigitAnalysis } from '@/lib/derivAnalysis'
import { setPrediction } from '@/state/ManualConfiguration/ManualConfigurationSlice'

export const CirclesAnalysis = () => {
    const ManualConfiguration = useSelector(
        (state: RootState) => state.ManualConfiguration
    )
    const tickHistory = useSelector((state: RootState) => state.tickHistory)
    const selectedMarket = useSelector(
        (state: RootState) => state.selectedMarket
    )

    const dispatch = useDispatch<AppDispatch>()

    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )
    const ticks = tickHistory[selectedAsset.symbol]['history']

    const reversedTicks = [...ticks].reverse() //from latest to olderst
    const lessTicks = reversedTicks.slice(0, 1000)

    const lastDigitList = DigitAnalysis.getLastDigitLists({
        ticks: lessTicks,
    })
    const percentage = DigitAnalysis.calculateDigitPercentage({
        ticks: lastDigitList,
    })

    const percentageSorted = [...percentage].sort(
        (a, b) => a.percentage - b.percentage
    ) //asc

    const least = percentageSorted[0]
    const most = percentageSorted[percentageSorted.length - 1]

    // const least2nd = percentageSorted[1]
    // const most2nd = percentageSorted[percentageSorted.length - 2]

    const predictionMarkets = ['Match/Differ', 'Over/Under']

    const isPredictionMarket = predictionMarkets.includes(selectedMarket)

    return (
        <div className='grid grid-cols-5 gap-2 rounded bg-gray-800 px-2 py-8 md:grid-cols-10 md:py-16'>
            {(() => {
                return percentage.map((value, index) => {
                    return (
                        <div
                            key={index}
                            className='flex flex-col items-center justify-center'
                            onClick={() => {
                                dispatch(setPrediction(value.digit))
                            }}
                        >
                            <div
                                className={`flex h-14 w-14 items-center justify-center border-2 border-gray-50 text-center md:h-24 md:w-24 ${
                                    isPredictionMarket &&
                                    ManualConfiguration.prediction ==
                                        value.digit
                                        ? 'bg-goldAli'
                                        : 'bg-gray-200'
                                } rounded-xl text-black`}
                            >
                                {value.digit}
                            </div>
                            <span
                                className={`p-1 text-xs ${
                                    value.percentage == most.percentage
                                        ? 'text-green-500'
                                        : value.percentage == least.percentage
                                          ? 'text-red-500'
                                          : ''
                                }`}
                            >
                                {value.percentage}%
                            </span>
                        </div>
                    )
                })
            })()}
        </div>
    )
}
