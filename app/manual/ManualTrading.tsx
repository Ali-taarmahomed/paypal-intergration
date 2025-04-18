'use client'
import React, { useEffect } from 'react'
import { ScrollableButtons } from './ScrollableButtons'
import { CirclesAnalysis } from './CirclesAnalysis'
import { ChartAnalysis } from './ChartAnalysis'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { useDerivWs } from '@/hooks/useDerivWs'
import NavBar from '../bots/NavBar'
import AccountInfoByBalance from '../bots/AccountInfo'
import BottomNav from '../BottomNavBar/bottomnavbar'
import { AssetSelection } from '../bots/AssetSelection'
import {
    MatchDiffersConfig,
    MatchDiffersTradeButtons,
} from './TradeCategories/MatchDiffers'
import { CustomToast } from '@/components/CustomToast'
import {
    OverUnderConfig,
    OverUnderTradeButtons,
} from './TradeCategories/OverUnder'
import { EvenOddConfig, EvenOddTradeButtons } from './TradeCategories/EvenOdd'
import {
    RiseFallConfig,
    RiseFallTradeButtons,
} from './TradeCategories/RiseFall'
import Loader from '@/components/Loader'
import { TickPrice } from './TickPrice'
import { TradeTable } from '../bots/TradeTable'
import { LoginWithDeriv } from '@/components/LoginWithDeriv'
import { Loading } from '@/components/Loading'
import { useSaveLastVisitedPath } from '@/hooks/useCleanPath'
import { Header } from '@/components/Header'

export const ManualTrading = () => {
    useSaveLastVisitedPath()
    const params = useGetQueryParams()
    let { token } = params

    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    if (token === undefined || token === null) {
        token = accountInfo.token
    }

    const { sendMessage, isReady, getTicks } = useDerivWs({
        token,
    })

    useEffect(() => {
        getTicks({ limit: 5000, assets: [selectedAsset.symbol] })
    }, [isReady, token, selectedAsset.symbol, getTicks])

    // useEffect(() => {
    //     //contracts_for
    //     sendMessage({
    //         contracts_for: selectedAsset.symbol,
    //         currency: accountInfo.currency,
    //         landing_company: 'svg',
    //         product_type: 'basic',
    //     })
    //     return () => {}
    // }, [isReady, token, selectedAsset.symbol])

    // useEffect(() => {
    //     //proposal
    //     const proposalRequestList = Object.keys(proposalsBasedOnType)

    //     const marketType =
    //         selectedContract.contract_type as keyof typeof proposalsBasedOnType

    //     const reqMessage = proposalsBasedOnType[marketType]

    //     reqMessage.contract_type = selectedContract.contract_type
    //     reqMessage.currency = accountInfo.currency
    //     reqMessage.symbol = selectedAsset.symbol

    //     if (proposalRequestList.includes(selectedContract.contract_type)) {
    //         sendMessage(reqMessage)
    //     }

    //     return () => {}
    // }, [isReady, selectedContract.contract_type, selectedAsset.symbol])

    if (token === undefined || token === null || token === '') {
        return <LoginWithDeriv />
    }

    if (!isReady) {
        return <Loader />
    }

    return (
        <>
            <Header token={token} />
            <div className='flex items-center justify-end px-3 py-4'>
                <AccountInfoByBalance sendMessage={sendMessage} />
            </div>
            <h1 className='mt-4 text-center text-3xl font-bold text-goldAli md:text-5xl'>
                DTC TRADER
            </h1>
            <MobileMode sendMessage={sendMessage} />
            <div className='mb-28 flex w-full'>
                <TradeTable />
            </div>

            <BottomNav token={token} />
            {/* <CustomToast /> */}
        </>
    )
}

const MobileMode = ({
    sendMessage,
}: {
    sendMessage: (message: any) => void
}) => {
    const selectedMarket = useSelector(
        (state: RootState) => state.selectedMarket
    )
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )
    const tickHistory = useSelector((state: RootState) => state.tickHistory)
    const ticks = tickHistory[selectedAsset.symbol]['history']
    const reversedTicks = [...ticks].reverse() //from latest to olderst

    return (
        // <div className='flex flex-col gap-1 md:hidden text-gray-100'>
        <div className='flex flex-col gap-1 pt-4 text-gray-100'>
            <ScrollableButtons />

            <div className='flex flex-col px-2'>
                {/* selecting volatility index */}
                <div className='flex w-full items-center justify-center px-3 py-2'>
                    <AssetSelection className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black' />
                </div>

                {/* price */}
                <div className='mb-4 flex w-full items-center justify-center rounded bg-gray-100 px-3 py-2 text-black'>
                    <TickPrice />
                </div>

                {(() => {
                    switch (selectedMarket) {
                        case 'Match/Differ':
                            return (
                                <>
                                    <CirclesAnalysis />
                                    <MatchDiffersConfig
                                        sendMessage={sendMessage}
                                    />
                                    <ChartAnalysis />
                                    <MatchDiffersTradeButtons
                                        sendMessage={sendMessage}
                                    />
                                </>
                            )
                        case 'Over/Under':
                            return (
                                <>
                                    <CirclesAnalysis />
                                    <OverUnderConfig
                                        sendMessage={sendMessage}
                                    />
                                    <ChartAnalysis />
                                    <OverUnderTradeButtons
                                        sendMessage={sendMessage}
                                    />
                                </>
                            )
                        case 'Even/Odd':
                            return (
                                <>
                                    <CirclesAnalysis />
                                    <EvenOddConfig sendMessage={sendMessage} />
                                    <ChartAnalysis />
                                    <EvenOddTradeButtons
                                        sendMessage={sendMessage}
                                    />
                                </>
                            )
                        case 'Rise/Fall':
                            return (
                                <>
                                    {/* <CirclesAnalysis /> */}
                                    <RiseFallConfig sendMessage={sendMessage} />
                                    <ChartAnalysis />
                                    <RiseFallTradeButtons
                                        sendMessage={sendMessage}
                                    />
                                </>
                            )
                        default:
                            return false
                    }
                })()}
            </div>
        </div>
    )
}
