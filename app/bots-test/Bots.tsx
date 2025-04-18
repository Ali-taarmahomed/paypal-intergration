// bots.tsx
import { useDerivWs } from '@/hooks/useDerivWs'
import React, { useEffect, useState, useRef } from 'react'
import { AppDispatch, RootState } from '@/state/store'
import { useDispatch, useSelector } from 'react-redux'
import { botsList } from './botsList'
import Link from 'next/link'
import { getbots } from './actions'
import { AssetSelection } from './AssetSelection'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { jsonToUrl } from '@/lib/json-to-url'
import { useBot } from './useBot'
import { useTradeSummary } from '@/hooks/useTradeSummary'
import { Modal } from '@/components/Modal'
import { TradeTable } from './TradeTable'
import {
    deleteTradeHistory,
    DerivTradeState,
} from '@/state/trades/tradeHistorySlice'
import { toast } from 'react-toastify'
import { convertCurrency } from '@/lib/currency-converter'
import { tradeIncrement } from '@/state/counter/counterSlice'
import NavBar from './NavBar' // Importing the NavBar component
import QuickNavigationButtons from '../QuickButtons/QuickNavigationButtons'
import { AccountInfoByBalance } from '../bots-test/AccountInfo'
import BottomNav from '../BottomNavBar/bottomnavbar' // Import BottomNav component

export const Bots = () => {
    const params = useGetQueryParams()
    let { token } = params
    const { balance, currency, loginid } = useSelector(
        (state: RootState) => state.derivUser
    )

    const dispatch = useDispatch<AppDispatch>()

    const [selectedBot, setSelectedBot] = useState<{
        name: string
        summary: string[]
        amountInUSD: number
        isAvailableOnDemo: boolean
        isPremium: boolean
    } | null>(null)

    const [isRunning, setIsRunning] = useState(false)
    const [isBotList, setIsBotList] = useState(false)
    const [stake, setStake] = useState<string>('5')
    const [multiplier, setMultiplier] = useState<string>('2.5')
    const [tp, setTp] = useState<string>('0')
    const [sl, setSl] = useState<string>('0')
    const [exchangeRate, setExchangeRate] = useState<number>(0)
    const [isConfigOpen, setIsConfigOpen] = useState(false)

    const botListRef = useRef<HTMLDivElement>(null)
    const configRef = useRef<HTMLDivElement>(null)

    const handleConfigChange = () => {
        setIsConfigOpen(prevState => !prevState)
    }

    const handleBotList = () => {
        setIsBotList(prevState => !prevState)
    }

    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const trades = useSelector((state: RootState) => state.trades)

    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    const tradeCount = useSelector((state: RootState) => state.tradeCount).value

    if (token === undefined || token === null) {
        token = accountInfo.token
    }

    const { sendMessage, isReady, getTicks } = useDerivWs({
        token,
    })

    const { profit } = useTradeSummary()

    useEffect(() => {
        getTicks({ limit: 5000, assets: [selectedAsset.symbol] })
    }, [isReady, token, selectedAsset.symbol, getTicks])

    const signals = useBot({
        stake: newStake(
            parseFloat(stake) || 0,
            parseFloat(multiplier) || 0,
            trades
        ),
        selectedBotData: selectedBot || botsList[0],
    })

    const tpNumber = parseFloat(tp) || 0
    const slNumber = parseFloat(sl) || 0

    if (profit >= tpNumber && isRunning && tpNumber !== 0) {
        setIsRunning(false)
        toast.success(
            `Profit target of ${Math.floor(profit * 100) / 100} ${
                accountInfo.currency
            } Hit`
        )
    }

    if (profit < 0 && profit < -slNumber && isRunning && slNumber !== 0) {
        setIsRunning(false)
        toast.error(
            `Stop Loss of ${Math.floor(profit * 100) / 100} ${
                accountInfo.currency
            } Hit`
        )
    }

    if (
        signals.length > 0 &&
        isRunning &&
        tradeCount <= 0 &&
        (!(profit >= tpNumber) || tpNumber === 0) &&
        (!(profit < 0 && profit < -slNumber) || slNumber === 0)
    ) {
        for (const signal of signals) {
            sendMessage(signal)
            dispatch(tradeIncrement())
        }
    }

    const [myBots, setMybots] = useState<string[] | null>(null)

    useEffect(() => {
        const fn = async () => {
            const res = await getbots({
                email: accountInfo.email,
                loginId: accountInfo.loginid,
                isConfirmed: true,
                isValid: true,
            })

            setMybots(() => {
                return res.map(value => value.botName)
            })
        }

        fn()
    }, [accountInfo.email, accountInfo.loginid])

    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const rate = await convertCurrency(1, 'USD', 'ZAR')
                setExchangeRate(rate)
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error)
            }
        }

        fetchExchangeRate()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isBotList &&
                botListRef.current &&
                !botListRef.current.contains(event.target as Node)
            ) {
                setIsBotList(false)
            }

            if (
                isConfigOpen &&
                configRef.current &&
                !configRef.current.contains(event.target as Node)
            ) {
                setIsConfigOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isBotList, isConfigOpen])

    const handleRunBot = () => {
        if (!selectedBot) {
            toast.warning('Please select a bot first!')
            return
        }
        setIsRunning(true)
    }

    return (
        <div className='flex min-h-screen flex-col text-gray-300'>
            <NavBar params={params} />
            {/*<div className='relative w-full z-9'>
                <QuickNavigationButtons token={token} />
            </div>*/}
            <div className='flex items-center justify-end px-3 py-4'>
                <AccountInfoByBalance sendMessage={sendMessage} />
            </div>
            <h1 className='mt-4 text-center text-5xl font-bold text-goldAli'>
                AI Bots By DTC
            </h1>

            <div className='flex flex-col items-center gap-4'>
                {/* Bot Selection */}
                <button
                    onClick={handleBotList}
                    className='mt-4 rounded-full border-2 border-goldAli bg-goldAli px-6 py-3 font-bold text-black hover:opacity-80'
                >
                    {selectedBot
                        ? selectedBot.name
                        : 'SELECT YOUR TRADING BOT HERE'}
                </button>

                <div className='w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                    <h2 className='text-2xl font-bold text-goldAli'>
                        Software Status
                    </h2>
                    <p className='text-lg font-bold'>
                        {isRunning ? (
                            <span className='text-green-500'>ACTIVE</span>
                        ) : (
                            <span className='text-red-500'>INACTIVE</span>
                        )}
                    </p>
                    <div className='mt-4 flex flex-col items-center justify-center gap-4'>
                        {isRunning ? (
                            <button
                                onClick={() => setIsRunning(false)}
                                className='w-full rounded-full bg-red-600 px-4 py-3 font-bold uppercase text-white hover:bg-red-700'
                            >
                                Stop Bot
                            </button>
                        ) : (
                            <button
                                onClick={handleRunBot}
                                className='w-full rounded-full bg-green-500 px-4 py-3 font-bold uppercase text-black hover:opacity-80'
                            >
                                Run Bot
                            </button>
                        )}

                        <div className='flex w-full justify-center'>
                            <button
                                onClick={handleConfigChange}
                                className='w-full cursor-pointer rounded-full bg-[#FF9F1C] px-4 py-2 text-lg font-bold text-black shadow-lg transition duration-300 hover:bg-opacity-90'
                            >
                                Bot Settings
                            </button>
                        </div>
                    </div>
                </div>

                <div className='w-full rounded-lg border-2 border-goldAli bg-[#141A26] p-4 text-center'>
                    <h2 className='text-2xl font-bold text-goldAli'>
                        Total Profit: {Math.floor(profit * 100) / 100}{' '}
                        {currency}
                    </h2>
                    <button
                        onClick={() => {
                            dispatch(deleteTradeHistory())
                        }}
                        className='w-full cursor-pointer rounded-full bg-[#FF9F1C] px-4 py-2 text-lg font-bold text-black shadow-lg transition duration-300 hover:bg-opacity-90'
                    >
                        Reset
                    </button>
                </div>
                <TradeTable />
            </div>
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
            <Modal key={2} isClosed={!isBotList} setIsClosed={setIsBotList}>
                <div
                    ref={botListRef}
                    className='max-h-[80vh] overflow-y-auto rounded-lg bg-[#1A1B25] p-4 text-gray-300'
                >
                    <button
                        onClick={handleBotList}
                        className='absolute right-2 top-2 text-2xl text-white'
                    >
                        &times;
                    </button>
                    <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                        Choose DTC Robot
                    </h2>
                    <div className='mt-4 grid grid-cols-1 gap-4'>
                        {botsList.map(value => {
                            const isDemo = accountInfo.is_virtual
                            return (
                                <div
                                    key={value.name}
                                    className='flex flex-col gap-3 rounded-lg border-4 border-goldAli bg-[#141A26] p-4 text-gray-300 shadow-lg'
                                >
                                    <h2 className='text-center text-lg font-bold'>
                                        {value.name}
                                    </h2>
                                    <ul className='text-center'>
                                        {value.summary.map(summary => (
                                            <li key={summary}>{summary}</li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() =>
                                            window.open(
                                                value.tutorialLink,
                                                '_blank'
                                            )
                                        }
                                        className='w-full rounded-lg bg-blue-500 px-4 py-2 text-center font-bold uppercase text-white hover:opacity-80'
                                    >
                                        Watch Tutorial
                                    </button>

                                    {!value.isPremium ||
                                    (value.isAvailableOnDemo && isDemo) ||
                                    (value.isPremium &&
                                        myBots?.includes(value.name)) ? (
                                        <button
                                            onClick={() => {
                                                setSelectedBot(value)

                                                const botConfig =
                                                    botsList.filter(
                                                        item =>
                                                            item.name ===
                                                            value.name
                                                    )[0].botConfig

                                                setStake(
                                                    String(botConfig.stake)
                                                )
                                                setMultiplier(
                                                    String(botConfig.martingale)
                                                )
                                                setTp(String(botConfig.tp))
                                                setSl(String(botConfig.sl))

                                                setIsBotList(false)
                                            }}
                                            className='w-full rounded-lg bg-goldAli px-4 py-2 text-center font-bold uppercase text-black hover:opacity-80'
                                        >
                                            Select Bot
                                        </button>
                                    ) : (
                                        <Link
                                            href={jsonToUrl({
                                                url: '/bots/buy',
                                                jsonData: {
                                                    email: accountInfo.email,
                                                    loginId:
                                                        accountInfo.loginid,
                                                    botName: value.name,
                                                    amountInUSD:
                                                        value.amountInUSD,
                                                    summary: JSON.stringify(
                                                        value.summary
                                                    ),
                                                },
                                            })}
                                        >
                                            <button className='w-full rounded-lg bg-goldAli px-4 py-2 text-center font-bold uppercase hover:bg-blue-600'>
                                                Purchase For
                                                {` R${
                                                    Math.floor(
                                                        value.amountInUSD *
                                                            exchangeRate *
                                                            100
                                                    ) / 100
                                                }/pm`}
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Modal>
            <BottomNav token={token} />
        </div>
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
