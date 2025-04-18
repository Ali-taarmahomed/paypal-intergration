'use client'
import { DerivTrade, DurationUnitT, EvenT, OverT } from '@/lib/tradeFormats'
import { DigitAnalysis } from '@/modules/derivHelper'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'

export const useBot = ({
    stake,
    selectedBotData,
}: {
    stake: number
    selectedBotData: {
        name: string
        summary: string[]
        amountInUSD: number
        isAvailableOnDemo: boolean
        isPremium: boolean
    }
}) => {
    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const tickHistory = useSelector((state: RootState) => state.tickHistory)
    const tradeHistory = useSelector((state: RootState) => state.trades)
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    const selectedBot = selectedBotData.name

    //trades
    const { overUnderMatchDiffers, evenOddRiseFall } = DerivTrade

    //event handles
    const evenOddRiseFallHandler = (contract: EvenT, duration: number) => {
        const contractJson = evenOddRiseFall({
            loginid: accountInfo.loginid,
            contract_type: contract,
            currency: accountInfo.currency,
            stake: stake,
            asset: selectedAsset.symbol,
            duration: duration, // botSetup.time,
            duration_unit: 't' as DurationUnitT,
            passthrough: {
                is_virtual_hook: accountInfo.is_virtual_hook,
            },
        })

        return contractJson
    }

    const overUnderMatchDiffersHandler = (
        contract: OverT,
        barrier: number,
        duration: number
    ) => {
        const contractJson = overUnderMatchDiffers({
            loginid: accountInfo.loginid,
            contract_type: contract,
            barrier: barrier,
            currency: accountInfo.currency,
            stake: stake,
            asset: selectedAsset.symbol,
            duration: duration, // botSetup.time,
            duration_unit: 't' as DurationUnitT,
            passthrough: {
                is_virtual_hook: accountInfo.is_virtual_hook,
            },
        })

        return contractJson
    }

    const ticks = tickHistory[selectedAsset.symbol]['history']

    const bots = [
        {
            name: 'INFINITY PULSE',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (lastDigitList[0] % 2 === 0 && lastDigitList[1] % 2 === 0) {
                    return [evenOddRiseFallHandler('DIGITEVEN', 1)]
                }

                if (lastDigitList[0] % 2 === 1 && lastDigitList[1] % 2 === 1) {
                    return [evenOddRiseFallHandler('DIGITEVEN', 1)]
                }

                return []
            },
        },

        {
            name: 'QUANTUM SURGE PREMIUM',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (lastDigitList[0] <= 2 && lastDigitList[1] > 2) {
                    return [overUnderMatchDiffersHandler('DIGITOVER', 2, 1)]
                }

                if (lastDigitList[0] >= 7 && lastDigitList[1] < 7) {
                    return [overUnderMatchDiffersHandler('DIGITUNDER', 7, 1)]
                }

                return []
            },
        },

        {
            name: 'TITAN EDGE',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to oldest
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (
                    lastDigitList[0] < 6 &&
                    lastDigitList[1] < 6 &&
                    lastDigitList[2] < 6
                ) {
                    return [overUnderMatchDiffersHandler('DIGITOVER', 6, 1)]
                }

                if (
                    lastDigitList[0] > 3 &&
                    lastDigitList[1] > 3 &&
                    lastDigitList[2] > 3
                ) {
                    return [overUnderMatchDiffersHandler('DIGITUNDER', 3, 1)]
                }

                return []
            },
        },

        {
            name: 'DUAL STRIKE PREMIUM',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (lastDigitList[0] === lastDigitList[1]) {
                    return [
                        overUnderMatchDiffersHandler(
                            'DIGITDIFF',
                            lastDigitList[0],
                            1
                        ),
                    ]
                }

                return []
            },
        },

        {
            name: 'Quantum Surge (Demo Only)',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (lastDigitList[0] <= 2 && lastDigitList[1] > 2) {
                    return [overUnderMatchDiffersHandler('DIGITOVER', 2, 1)]
                }

                if (lastDigitList[0] >= 7 && lastDigitList[1] < 7) {
                    return [overUnderMatchDiffersHandler('DIGITUNDER', 7, 1)]
                }

                return []
            },
        },

        {
            name: 'THE ALPHA PREMIUM',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                return [
                    overUnderMatchDiffersHandler(
                        'DIGITDIFF',
                        lastDigitList[0],
                        1
                    ),
                ]
            },
        },

        {
            name: 'ODDYSSEY PRO',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (
                    lastDigitList[0] % 2 === 0 &&
                    lastDigitList[1] % 2 === 0 &&
                    lastDigitList[2] % 2 === 0
                ) {
                    return [evenOddRiseFallHandler('DIGITODD', 1)]
                }

                if (
                    lastDigitList[0] % 2 === 1 &&
                    lastDigitList[1] % 2 === 1 &&
                    lastDigitList[2] % 2 === 1
                ) {
                    return [evenOddRiseFallHandler('DIGITEVEN', 1)]
                }

                return []
            },
        },

        {
            name: 'SWITCHER PRO',
            func: () => {
                const reversedTicks = [...ticks].reverse() //from latest to olderst
                const lessTicks = reversedTicks.slice(0, 1000)
                const lastDigitList = DigitAnalysis.getLastDigitLists({
                    ticks: lessTicks,
                })

                if (tradeHistory[0].contract_type === 'DIGITEVEN') {
                    return [evenOddRiseFallHandler('DIGITODD', 1)]
                } else if (tradeHistory[0].contract_type === 'DIGITODD') {
                    return [evenOddRiseFallHandler('DIGITEVEN', 1)]
                } else {
                    return [evenOddRiseFallHandler('DIGITEVEN', 1)]
                }

                return []
            },
        },
    ]

    // running selected bots
    const runBot = bots
        .filter(value => value.name === selectedBot)
        .map(value => value.func)

    for (const item of runBot) {
        return item()
    }

    return []
}
