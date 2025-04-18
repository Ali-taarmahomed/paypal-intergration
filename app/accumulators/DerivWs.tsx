'use client'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import { useDerivWs } from '@/hooks/useDerivWs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Loading } from '@/components/Loading'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { DerivTrade } from '@/lib/tradeFormats'

import {
    accumulatorsAutoEntryExit,
    profitsFromAutoEntry,
} from '@/lib/accumulators-auto-entry-exit'
import { useTradeSummary } from '@/hooks/useTradeSummary'
import {
    deleteTradeHistory,
    DerivTradeState,
} from '@/state/trades/tradeHistorySlice'
import { tradeIncrement } from '@/state/counter/counterSlice'
import AccountInfo from '../bots/AccountInfo'

import { AssetSelection } from '../bots/AssetSelection'
import { DigitChart } from '../DigitChart/DigitChart'
import { Modal } from '@/components/Modal'
import { TradeTable } from '../bots/TradeTable'
import NavBar from '../bots/NavBar'
import { toast } from 'react-toastify'
import QuickNavigationButtons from '../QuickButtons/QuickNavigationButtons'
import { AccountInfoByBalance } from '../bots/AccountInfo'
import BottomNav from '../BottomNavBar/bottomnavbar' // Import BottomNav component
import Loader from '@/components/Loader'
import { LoginWithDeriv } from '@/components/LoginWithDeriv'
import { useSaveLastVisitedPath } from '@/hooks/useCleanPath'
import { Header } from '@/components/Header'

export const DerivWs = () => {
    useSaveLastVisitedPath()
    const params = useGetQueryParams()
    let { token } = params
    const dispatch = useDispatch<AppDispatch>()
    const { balance, currency, loginid } = useSelector(
        (state: RootState) => state.derivUser
    )

    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const accumulatorStat = useSelector(
        (state: RootState) => state.accumulatorStat
    )

    const [stake, setStake] = useState<string>('1')
    const [multiplier, setMultiplier] = useState<string>('3')
    const [tp, setTp] = useState<string>('0')
    const [sl, setSl] = useState<string>('0')
    const [isConfigOpen, setIsConfigOpen] = useState(false)
    const configRef = useRef<HTMLDivElement>(null)

    if (token === undefined || token === null) {
        token = accountInfo.token
    }

    const handleConfigChange = () => {
        setIsConfigOpen(prevState => !prevState)
    }

    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )
    const tickHistory = useSelector((state: RootState) => state.tickHistory)
    const trades = useSelector((state: RootState) => state.trades)

    const [percentage, setPercentage] = useState(5)
    const [takeProfit, setTakeProfit] = useState('1')
    const [entry, setEntry] = useState('none')
    const [exit, setExit] = useState('none')

    const [isDynamicTp, setIsDynamicTp] = useState(true)
    const [isAuto, setIsAuto] = useState(false)
    const [isStat, setIsStat] = useState(false)
    const [isDynamic, setIsDynamic] = useState(true)

    useEffect(() => {
        setIsDynamicTp(prev => prev)
        setIsDynamic(prev => prev)
    }, [])

    const { isReady, sendMessage, getTicks } = useDerivWs({ token })

    const myTicks = tickHistory[selectedAsset.symbol]['history']
    const [tickCount] = useState(20)
    const reversedTicks = [...myTicks].reverse() //from latest to olderst
    const lessTicks = reversedTicks.slice(0, tickCount)
    const { accumulators, sellContract } = DerivTrade
    const { profit } = useTradeSummary()

    const tpNumber = parseFloat(tp) || 0
    const slNumber = parseFloat(sl) || 0

    if (profit >= tpNumber && isAuto && tpNumber !== 0) {
        setIsAuto(false)
        toast.success(
            `Profit target of ${Math.floor(profit * 100) / 100} ${
                accountInfo.currency
            } Hit`
        )
    }

    if (profit < 0 && profit < -slNumber && isAuto && slNumber !== 0) {
        setIsAuto(false)
        toast.error(
            `Stop Loss of ${Math.floor(profit * 100) / 100} ${
                accountInfo.currency
            } Hit`
        )
    }

    const accumulatorsHandler = ({
        loginid,
        currency,
        stake,
        asset,
        percentage,
        takeProfit,
    }: {
        loginid: string
        currency: string
        stake: number
        asset: string
        percentage: number
        takeProfit: number
    }) => {
        dispatch(tradeIncrement())

        return accumulators({
            loginid,
            currency,
            stake,
            asset,
            percentage,
            takeProfit,
            passthrough: {
                is_virtual_hook: accountInfo.is_virtual_hook,
            },
        })
    }

    const accumulatorStats = [
        ...accumulatorStat[`${selectedAsset.symbol}_${percentage}`]
            .ticks_stayed_in,
    ].reverse()

    const autoEs = useCallback(
        (accumulatorStats: number[]) => {
            return accumulatorsAutoEntryExit(accumulatorStats)
        },
        [accumulatorStat]
    )

    useEffect(() => {
        for (let i = 1; i <= 5; i++) {
            sendMessage({
                subscribe: 1,
                proposal: 1,
                amount: newStake(
                    parseFloat(stake),
                    parseFloat(multiplier),
                    trades
                ),
                basis: 'stake',
                contract_type: 'ACCU',
                currency: 'USD',
                symbol: selectedAsset.symbol,
                growth_rate: i / 100,
                passthrough: { percentage: i },
            })
        }
    }, [isReady, selectedAsset.symbol])

    useEffect(() => {
        //get ticks
        getTicks({ limit: 5000, assets: [selectedAsset.symbol] })
    }, [isReady, token, selectedAsset.symbol])

    useEffect(() => {
        const func = () => {
            let targetProfit = null
            if (isDynamic) {
                const { entry, exit } = autoEs(accumulatorStats)
                targetProfit = profitsFromAutoEntry(entry, exit, percentage)

                if (entry === null || exit === null) {
                    console.log('No exit and entry')
                    // setEntry('none')
                    // setExit('none')
                    return
                } else {
                    setEntry(prev => {
                        console.log(prev)
                        return String(entry)
                    })
                    setExit(prev => {
                        console.log(prev)
                        return String(exit)
                    })
                    setTakeProfit(prev => {
                        console.log(prev)
                        return 'none'
                    })
                }
            }
            let myTp = parseFloat(takeProfit)
            if (trades[0].contract_type === 'ACCU') {
                if (
                    isDynamicTp &&
                    trades[0].buy_price <
                        newStake(
                            parseFloat(stake),
                            parseFloat(multiplier),
                            trades
                        )
                ) {
                    const factor =
                        newStake(
                            parseFloat(stake),
                            parseFloat(multiplier),
                            trades
                        ) /
                        newStake(
                            parseFloat(stake),
                            parseFloat(multiplier),
                            trades
                        )
                    myTp = myTp * factor
                }
            }
            //exit
            let exitSignal = false
            if (exit !== 'none') {
                const exitCount = parseInt(exit)

                if (exitCount === accumulatorStats[0]) {
                    exitSignal = true
                }
            }

            if (
                trades[0].status === 'Pending' &&
                trades[0].contract_type === 'ACCU' &&
                exitSignal
            ) {
                sendMessage(
                    sellContract({
                        loginid: accountInfo.loginid,
                        contract_id: trades[0].contract_id,
                        price: 0,
                        passthrough: {
                            is_virtual_hook: accountInfo.is_virtual_hook,
                        },
                    })
                )
            }

            //entry
            let signal = false
            if (entry === 'none') {
                signal = true
            } else {
                const entryCount = parseInt(entry)

                if (entryCount === accumulatorStats[0]) {
                    signal = true
                }
            }
            if (
                isAuto &&
                // !isTargetHit &&
                signal &&
                (trades[0].status !== 'Pending' ||
                    (trades[0].entry_tick === '#' && trades.length === 1))
            ) {
                if (
                    takeProfit === 'none' &&
                    exit !== 'none' &&
                    targetProfit !== null
                ) {
                    myTp =
                        Math.floor(
                            newStake(
                                parseFloat(stake),
                                parseFloat(multiplier),
                                trades
                            ) *
                                targetProfit *
                                100
                        ) / 100

                    console.log('Tp exit: ', myTp)
                }

                const singleBuy = accumulatorsHandler({
                    loginid: accountInfo.loginid,
                    currency: accountInfo.currency,
                    stake: newStake(
                        parseFloat(stake),
                        parseFloat(multiplier),
                        trades
                    ),
                    asset: selectedAsset.symbol,
                    percentage: percentage,
                    takeProfit: myTp,
                })

                sendMessage(singleBuy)
            }
        }

        func()
    }, [isReady, isAuto, trades[0].status, accumulatorStats[0]])

    if (token === undefined || token === null || token === '') {
        return (
            <div className='flex h-screen w-full items-center justify-center'>
                <Link
                    className='bg-DarkerBlue px-3 py-2 text-white hover:opacity-80'
                    href={`/login`}
                >
                    Click To login
                </Link>
            </div>
        )
    }

    if (token === undefined || token === null || token === '') {
        return <LoginWithDeriv />
    }

    if (!isReady) {
        return <Loader />
    }

    return (
        <>
            <Header token={token} />
            {/*<div>
                <QuickNavigationButtons token={token} />
            </div>*/}

            <div className='flex items-center justify-end px-3 py-4'>
                <AccountInfoByBalance sendMessage={sendMessage} />
            </div>

            <div className='mt-4'>
                <h1 className='text-center text-4xl font-bold text-goldAli'>
                    Accumulators By DTC
                </h1>
            </div>

            <div className='flex items-center justify-center p-2 md:h-[40%] md:w-[100%]'>
                <DigitChart data={lessTicks} />
            </div>

            {/* Percentage Selection Block */}
            <div className='mb-4 w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                <h2 className='mb-2 text-2xl font-bold text-goldAli'>
                    Select Profit Gain Percentage
                </h2>
                <div className='grid grid-cols-5 gap-1'>
                    {[1, 2, 3, 4, 5].map(value => (
                        <button
                            key={String(value)}
                            onClick={e => {
                                const myPercentage = parseInt(
                                    e.currentTarget.value
                                )
                                setPercentage(myPercentage)
                            }}
                            className={`rounded-lg border-2 border-goldAli p-2 text-xs ${
                                value === percentage
                                    ? 'bg-goldAli text-black'
                                    : 'bg-[#141A26] text-white hover:bg-goldAli hover:text-black'
                            }`}
                            value={value}
                        >
                            {String(value)}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Block */}
            <div className='mb-4 w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                <h2 className='mb-2 text-2xl font-bold text-goldAli'>
                    Statistics:{' '}
                </h2>
                <div className='mb-4 grid grid-cols-3 items-center gap-1'>
                    {accumulatorStats.slice(0, 3).map((value, index) => (
                        <div
                            key={`${value}-${index}`}
                            className='rounded-lg border-2 border-goldAli bg-[#141A26] p-2 text-center text-xs text-white'
                        >
                            {String(value)}
                        </div>
                    ))}
                </div>
                <div className='flex items-center justify-center'>
                    <button
                        onClick={() => setIsStat(!isStat)}
                        className='w-full rounded-lg bg-goldAli px-4 py-2 text-black hover:opacity-80'
                    >
                        {isStat ? 'Hide Stat' : 'Show Past Stats'}
                    </button>
                </div>
            </div>

            {/* Expanded Stats Block */}
            {isStat && (
                <div className='mb-4 w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                    <div className='grid grid-cols-4 gap-1 md:grid-cols-10'>
                        {accumulatorStats.map((value, index) => (
                            <div
                                key={`${value}-${index}`}
                                className='rounded-lg border-2 border-goldAli bg-[#141A26] p-2 text-center text-xs text-white'
                            >
                                {String(value)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className='flex flex-col items-center justify-center gap-4'>
                <Modal
                    key={1}
                    isClosed={!isConfigOpen}
                    setIsClosed={setIsConfigOpen}
                >
                    <div
                        ref={configRef}
                        className='max-h-[80vh] overflow-y-auto rounded-lg bg-[#1A1B25] p-4 text-gray-300'
                    >
                        <button
                            onClick={handleConfigChange}
                            className='absolute right-2 top-2 text-2xl text-white'
                        >
                            &times;
                        </button>
                        <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                            Bot Configuration
                        </h2>

                        <div className='mt-4 flex flex-col gap-4'>
                            <div className='flex flex-col'>
                                <label className='text-left capitalize'>
                                    Asset
                                </label>
                                <AssetSelection className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black' />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-left capitalize'>
                                    Stake
                                </label>
                                <input
                                    type='text'
                                    onChange={e => {
                                        const value = e.target.value
                                        setStake(value)
                                    }}
                                    value={stake}
                                    className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                    placeholder='Enter Stake'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-left capitalize'>
                                    Martingale Factor
                                </label>
                                <input
                                    type='text'
                                    onChange={e => {
                                        const value = e.target.value
                                        setMultiplier(value)
                                    }}
                                    value={multiplier}
                                    className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                    placeholder='Enter Martingale Factor'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-left capitalize'>
                                    Take Profit
                                </label>
                                <input
                                    type='text'
                                    onChange={e => {
                                        const value = e.target.value
                                        setTp(value)
                                    }}
                                    value={tp}
                                    className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                    placeholder='Enter Take Profit'
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className='text-left capitalize'>
                                    Stop Loss
                                </label>
                                <input
                                    type='text'
                                    onChange={e => {
                                        const value = e.target.value
                                        setSl(value)
                                    }}
                                    value={sl}
                                    className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                    placeholder='Enter Stop Loss'
                                />
                            </div>

                            <button
                                onClick={handleConfigChange}
                                className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>

            {/* <div className='grid grid-cols-1 md:grid-cols-4'>
                <div className='flex flex-col px-4'>
                    <label htmlFor=''>Asset</label>
                    <AssetSelection className=' px-3 py-2 border border-blue-600 ' />
                </div>

                <div className='flex flex-col px-4'>
                    <label htmlFor='entry'>Auto Entry @</label>
                    <input
                        className=' px-3 py-2 border border-blue-600 '
                        type='text'
                        name='entry'
                        value={entry}
                        onChange={e => {
                            const entry = e.currentTarget.value

                            setEntry(prev => entry)
                        }}
                        placeholder='Enter Auto entry @'
                        required
                    />
                </div>

                <div className='flex flex-col px-4'>
                    <label htmlFor='exit'>Auto Exit @</label>
                    <input
                        className=' px-3 py-2 border border-blue-600 '
                        type='text'
                        name='exit'
                        value={exit}
                        onChange={e => {
                            const exit = e.currentTarget.value

                            setExit(prev => exit)
                            setTakeProfit(prev => 'none')
                        }}
                        placeholder='Enter Auto exit @'
                        required
                    />
                </div>

                <div className='flex flex-col px-4'>
                    <label htmlFor='takeProfit'>takeProfit</label>
                    <input
                        className=' px-3 py-2 border border-blue-600 '
                        type='text'
                        name='takeProfit'
                        value={takeProfit}
                        onChange={e => {
                            const takeProfit =
                                Math.floor(
                                    parseFloat(e.currentTarget.value) * 100
                                ) / 100

                            setTakeProfit(prev => String(takeProfit))
                            setExit(prev => 'none')
                        }}
                        placeholder='Enter takeProfit'
                        required
                    />
                </div>
            </div> */}

            {/* <div className='w-full flex gap-1 px-4 py-4'>
                <input
                    type='checkbox'
                    checked={isDynamicTp}
                    onChange={() => {
                        setIsDynamicTp(prev => !prev)
                    }}
                    name=''
                    id=''
                />
                <label htmlFor=''>Use Dynamic Tp</label>
            </div>

            <div className='w-full flex gap-1 px-4 py-4'>
                <input
                    type='checkbox'
                    checked={isDynamic}
                    onChange={() => {
                        setIsDynamic(prev => !prev)
                    }}
                    name=''
                    id=''
                />
                <label htmlFor=''>Use Dynamic Entry & Exit</label>
            </div> */}

            {/* <div className='flex justify-evenly gap-3 py-4 px-4'>
                <div className='w-full'>
                    <button
                        className='w-full text-xs rounded px-3 py-2 bg-green-500 text-white hover:opacity-80'
                        onClick={() => {
                            const singleBuy = accumulatorsHandler({
                                loginid: accountInfo.loginid,
                                currency: accountInfo.currency,
                                stake: parseFloat(stake),
                                asset: selectedAsset.symbol,
                                percentage: percentage,
                                takeProfit: parseFloat(takeProfit),
                            })

                            sendMessage(singleBuy)
                        }}
                    >
                        Buy @ {stake} {accountInfo.currency}
                    </button>
                </div>

                <div className='w-full'>
                    {(trades[0].entry_tick === '#' && trades.length === 1) ||
                    trades[0].status !== 'Pending' ? (
                        <button className='w-full text-xs rounded px-3 py-2 bg-gray-500 text-white hover:opacity-80'>
                            sell Invalid
                        </button>
                    ) : (
                        <button
                            className='w-full text-xs rounded px-3 py-2 bg-red-500 text-white hover:opacity-80'
                            onClick={() => {
                                sendMessage(
                                    sellContract({
                                        loginid: accountInfo.loginid,
                                        contract_id: trades[0].contract_id,
                                        price: 0,
                                        passthrough: {
                                            is_virtual_hook:
                                                accountInfo.is_virtual_hook,
                                        },
                                    })
                                )
                            }}
                        >
                            sell @ {String(trades[0].sell_price)}{' '}
                            {accountInfo.currency}
                        </button>
                    )}
                </div>
            </div> */}

            <div className='mb-4 w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                <h2 className='text-2xl font-bold text-goldAli'>
                    Software Status
                </h2>
                <p className='text-lg font-bold'>
                    {isAuto ? (
                        <span className='text-green-500'>ACTIVE</span>
                    ) : (
                        <span className='text-red-500'>INACTIVE</span>
                    )}
                </p>
                <div className='mt-4 flex flex-col items-center justify-center gap-4'>
                    <button
                        onClick={() => setIsAuto(prev => !prev)}
                        className={`w-full rounded-full px-4 py-3 font-bold ${
                            isAuto ? 'bg-red-500' : 'bg-green-500'
                        } text-black hover:opacity-80`}
                    >
                        {isAuto
                            ? 'Stop Auto Accumulator'
                            : 'Start Auto Accumulator'}
                    </button>

                    <button
                        onClick={handleConfigChange}
                        className='mt-1.5 w-full rounded-full bg-goldAli px-4 py-3 font-bold text-black transition duration-300 hover:opacity-80'
                    >
                        Bot Settings
                    </button>
                </div>
            </div>

            <div className='mb-4 w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                <h2 className='text-2xl font-bold text-goldAli'>
                    Total Profit: {Math.floor(profit * 100) / 100}{' '}
                    {accountInfo.currency}
                </h2>
                <button
                    onClick={() => {
                        dispatch(deleteTradeHistory())
                    }}
                    className='w-full cursor-pointer rounded-full bg-goldAli px-4 py-3 font-bold text-black transition duration-300 ease-in-out hover:opacity-80'
                >
                    Reset
                </button>
            </div>

            <TradeTable />
            <div className='py-16'>&nbsp;</div>
            <BottomNav token={token} />
        </>
    )
}

export function newStake(
    stake: number,
    multiplier: number,
    tradeData: DerivTradeState[]
) {
    let loseCount = 0
    const newStake = stake
    const myMultiplier = multiplier

    for (let i = 0; i < tradeData.length; i++) {
        if (tradeData[i].status === 'Lost') {
            loseCount++
        } else {
            break
        }
    }

    return Math.floor(newStake * myMultiplier ** loseCount * 100) / 100
}
