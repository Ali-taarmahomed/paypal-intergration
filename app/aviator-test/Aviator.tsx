import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import { useDerivWs } from '@/hooks/useDerivWs'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { useEffect, useState, useRef } from 'react'
import { DerivTrade } from '@/lib/tradeFormats'
import { Suspense } from 'react'
import { GrHistory } from 'react-icons/gr'
import AviatorGraph from './aviatorchart'
import { MyLineChartStatic } from './MyLineChart-static'
import { useTradeSummary } from '@/hooks/useTradeSummary'
import {
    deleteTradeHistory,
    DerivTradeState,
} from '@/state/trades/tradeHistorySlice'
import { GrPowerReset } from 'react-icons/gr'
import { tradeIncrement } from '@/state/counter/counterSlice'
import NavBar from '../bots/NavBar'
import { toast } from 'react-toastify'
import { AccountInfoByBalance } from '../bots/AccountInfo'
import QuickNavigationButtons from '../QuickButtons/QuickNavigationButtons'
import BottomNav from '../BottomNavBar/bottomnavbar' // Import BottomNav component

export const Aviator = () => {
    const params = useGetQueryParams()
    let { token } = params
    const dispatch = useDispatch<AppDispatch>()
    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const percentage = 5
    const [isBuy, setIsBuy] = useState(false)
    const [isAuto, setIsAuto] = useState(false)
    const [isAutoCashOut, setIsAutoCashOut] = useState(false)
    const [cashoutMultiplier, setCashoutMultiplier] = useState('1.55')
    const aiEntry = 4
    const [isAdvanceConfig, setIsAdvanceConfig] = useState(false)
    const [isMoreStat, setIsMoreStat] = useState(false)

    const accumulatorStat = useSelector(
        (state: RootState) => state.accumulatorStat
    )

    if (token === undefined || token === null) {
        token = accountInfo.token
    }
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    const [stake, setStake] = useState<string>('10.00')
    const [multiplier, setMultiplier] = useState<string>('3')
    const [tp, setTp] = useState<string>('0')
    const [sl, setSl] = useState<string>('0')

    const comissionBased =
        process.env.NEXT_NODE_ENV === 'development' ? 1 : 0.97
    const trades = useSelector((state: RootState) => state.trades)
    const { isReady, sendMessage, getTicks } = useDerivWs({ token })
    const { profit } = useTradeSummary()
    const { accumulators, sellContract } = DerivTrade

    const accumulatorStats = [
        ...accumulatorStat[`${selectedAsset.symbol}_5`].ticks_stayed_in,
    ].reverse()

    const [currentValue, setCurrentValue] = useState(1.0)
    const [targetValue, setTargetValue] = useState(1.0)
    const incrementInterval = useRef<number | null>(null)
    let incrementIntervalTime = 10
    const stepDecreaseRate = 0

    useEffect(() => {
        if (accumulatorStats && accumulatorStats[0] >= aiEntry) {
            const newTargetValue =
                Math.floor(
                    comissionBased *
                        (1 + percentage / 100) **
                            (accumulatorStats[0] - aiEntry - 1) *
                        100
                ) / 100
            setTargetValue(newTargetValue)

            if (currentValue === 1.0) {
                setCurrentValue(newTargetValue)
            }
        }
    }, [accumulatorStats, aiEntry, comissionBased, percentage])

    useEffect(() => {
        if (accumulatorStats[0] === 0) {
            setCurrentValue(1.01)
        }
    }, [accumulatorStats[0]])

    useEffect(() => {
        if (incrementInterval.current) {
            clearInterval(incrementInterval.current)
        }

        // Calculate number of ticks and interval time dynamically
        const calculateIncrementIntervalTime = (
            startValue: number,
            endValue: number
        ) => {
            const ticks = Math.ceil((endValue - startValue) / 0.01) + 1 // Number of ticks for 0.01 increments
            return Math.floor(2000 / ticks) // Total 2 seconds divided by number of ticks
        }

        incrementIntervalTime = calculateIncrementIntervalTime(
            currentValue,
            targetValue
        )

        // Update the interval for smooth ticking
        incrementInterval.current = window.setInterval(() => {
            setCurrentValue(prevValue => {
                if (prevValue < targetValue) {
                    const nextValue = parseFloat((prevValue + 0.01).toFixed(2))
                    return Math.min(nextValue, targetValue)
                } else if (prevValue > targetValue) {
                    const nextValue = parseFloat((prevValue - 0.01).toFixed(2))
                    return Math.max(nextValue, targetValue)
                } else {
                    // Target reached, clear interval
                    if (incrementInterval.current) {
                        clearInterval(incrementInterval.current)
                        incrementInterval.current = null
                    }
                    return prevValue
                }
            })

            // Adjust interval time dynamically
            incrementIntervalTime = Math.max(
                1,
                incrementIntervalTime * (1 - stepDecreaseRate / 100)
            )
        }, incrementIntervalTime)

        return () => {
            if (incrementInterval.current) {
                clearInterval(incrementInterval.current)
            }
        }
    }, [targetValue])

    const myNewStake = newStake(
        parseFloat(stake),
        parseFloat(multiplier),
        trades
    )

    useEffect(() => {
        for (let i = 1; i <= 5; i++) {
            sendMessage({
                subscribe: 1,
                proposal: 1,
                amount: myNewStake,
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
        getTicks({ limit: 5000, assets: [selectedAsset.symbol] })
    }, [isReady, token, selectedAsset.symbol])

    useEffect(() => {
        if ((isBuy || isAuto) && accumulatorStats[0] === aiEntry) {
            setIsBuy(prev => {
                console.log(prev)
                return false
            })

            const tp =
                (myNewStake * (parseFloat(cashoutMultiplier) - 1) * 100) / 100

            const singleBuy = accumulators({
                loginid: accountInfo.loginid,
                currency: accountInfo.currency,
                stake: myNewStake,
                asset: selectedAsset.symbol,
                percentage: percentage,
                takeProfit: isAutoCashOut ? tp : parseFloat('null'),
                passthrough: {
                    is_virtual_hook: accountInfo.is_virtual_hook,
                },
            })

            sendMessage(singleBuy)
            dispatch(tradeIncrement())
        }
    }, [accumulatorStats[0]])

    const showInit =
        trades[0].status !== 'Pending' ||
        (trades.length === 1 && trades[0].entry_tick === '#')

    return (
        <>
            <NavBar params={params} />

            {/*<div>
                <QuickNavigationButtons token={token} />
            </div>*/}

            <div className='flex items-center justify-end px-3 py-4'>
                <AccountInfoByBalance sendMessage={sendMessage} />
            </div>

            <h1 className='text-center text-5xl font-bold text-goldAli'>
                Aviator By DTC
            </h1>

            <div className='container'>
                <div className='my-4 w-screen border-t border-gray-600'></div>
            </div>

            <div className='mb-8 grid grid-cols-1 gap-2 px-4 md:grid-cols-5 md:px-8'>
                <div className='flex flex-col items-center gap-1 md:col-span-3'>
                    <div className='grid w-full grid-cols-4 items-center gap-1 md:grid-cols-8'>
                        {(() => {
                            const arr = []

                            for (const item of accumulatorStats.slice(
                                1,
                                isMoreStat ? accumulatorStats.length : 9
                            )) {
                                const multipler =
                                    Math.floor(
                                        comissionBased *
                                            (1 + percentage / 100) **
                                                (item - aiEntry) *
                                            100
                                    ) / 100

                                if (multipler >= 1) {
                                    arr.push(
                                        <div
                                            className={`w-full rounded-lg px-2 py-1 ${
                                                item > 30
                                                    ? 'bg-green-500'
                                                    : item > 10
                                                      ? 'bg-orange-500'
                                                      : 'bg-red-500'
                                            } text-center text-sm text-black`}
                                        >
                                            {multipler}X
                                        </div>
                                    )
                                }
                            }
                            return arr
                        })()}

                        <button
                            onClick={() => {
                                setIsMoreStat(prev => !prev)
                            }}
                            className='flex w-full items-center justify-center rounded-lg bg-yellow-500 px-2 py-1 text-center text-sm font-bold text-black'
                        >
                            <GrHistory className='text-black' />
                        </button>
                    </div>

                    <div className='container'>
                        <div className='my-4 -ml-4 w-[calc(100%+2rem)] border-t border-gray-600 md:-ml-8 md:w-[calc(100%+4rem)]'></div>
                    </div>

                    <div className='flex w-full flex-col gap-1'>
                        <div
                            className='container mx-auto h-[300px] p-4 md:h-[500px]'
                            style={{
                                maxWidth: '1200px',
                                width: '100%',
                                backgroundColor: 'transparent',
                                border: '5px solid #f39c12',
                                borderRadius: '8px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Conditionally Render CurrentValue Only When the Graph is Shown */}
                            {accumulatorStats[0] !== 0 &&
                                accumulatorStats[0] >= aiEntry + 2 && (
                                    <div
                                        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-3/4 transform'
                                        style={{
                                            zIndex: 9, // Ensures it appears above the graph
                                        }}
                                    >
                                        <p
                                            className='text-6xl font-bold md:text-8xl'
                                            style={{
                                                color: '#f39c12',
                                            }}
                                        >
                                            {`${currentValue}X`}
                                        </p>
                                    </div>
                                )}

                            {/* Graph and Other Elements Section */}
                            <div className='flex h-full w-full items-center justify-center'>
                                <div className='flex h-full w-full items-center justify-center overflow-hidden'>
                                    <div className='flex h-full w-full flex-wrap items-center justify-center p-2 md:p-4'>
                                        {(() => {
                                            if (
                                                accumulatorStats[1] <=
                                                    aiEntry &&
                                                accumulatorStats[0] === 0
                                            ) {
                                                if (
                                                    trades[0].contract_type ===
                                                        'ACCU' &&
                                                    trades[0].status ===
                                                        'Pending'
                                                ) {
                                                    sendMessage(
                                                        sellContract({
                                                            loginid:
                                                                accountInfo.loginid,
                                                            contract_id:
                                                                trades[0]
                                                                    .contract_id,
                                                            price: 0,
                                                            passthrough: {
                                                                is_virtual_hook:
                                                                    accountInfo.is_virtual_hook,
                                                            },
                                                        })
                                                    )
                                                }

                                                return (
                                                    <div className='flex h-full w-full flex-col items-center justify-center gap-1 text-center'>
                                                        <h2 className='text-2xl font-bold text-orange-600 md:text-3xl'>
                                                            Restarting
                                                        </h2>
                                                    </div>
                                                )
                                            }

                                            if (accumulatorStats[0] === 0) {
                                                return (
                                                    <div className='flex h-full w-full flex-col items-center justify-center gap-1 text-center'>
                                                        <h2 className='text-2xl font-bold text-goldAli md:text-3xl'>
                                                            Crashed
                                                        </h2>
                                                    </div>
                                                )
                                            }

                                            if (
                                                accumulatorStats[0] <
                                                aiEntry + 2
                                            ) {
                                                return (
                                                    <div className='flex h-full w-full flex-col items-center justify-center gap-1 text-center'>
                                                        <h2 className='text-2xl font-bold text-orange-600 md:text-3xl'>
                                                            Next Round In
                                                        </h2>
                                                        <ProgressBar
                                                            myCount={
                                                                aiEntry +
                                                                2 -
                                                                accumulatorStats[0]
                                                            }
                                                        />
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div className='flex h-full w-full flex-col items-center justify-center text-center'>
                                                    <div className='flex h-full w-full flex-col items-center justify-center text-center'>
                                                        <div className='flex h-full w-full items-center justify-center'>
                                                            <AviatorGraph />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex w-full flex-col items-center rounded-lg bg-gray-800 p-4'>
                            <div className='flex w-full flex-col items-center rounded-lg bg-gray-800 p-4'>
                                <div className='flex w-full flex-col items-center justify-center gap-4 md:flex-row'>
                                    <div className='flex w-full flex-row items-center justify-center gap-4 md:w-1/2'>
                                        <div className='flex flex-col items-center'>
                                            <div className='flex items-center'>
                                                <button
                                                    onClick={() =>
                                                        setStake(prev =>
                                                            Math.max(
                                                                parseFloat(
                                                                    prev
                                                                ) - 1,
                                                                1
                                                            ).toString()
                                                        )
                                                    }
                                                    className='rounded-l-md bg-gray-700 px-3 py-2 text-white'
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type='text'
                                                    value={stake}
                                                    onChange={e =>
                                                        setStake(
                                                            e.target.value ||
                                                                '1'
                                                        )
                                                    }
                                                    className='w-16 border-b border-t border-gray-700 bg-gray-900 px-2 py-2 text-center text-white'
                                                />
                                                <button
                                                    onClick={() =>
                                                        setStake(prev =>
                                                            (
                                                                parseFloat(
                                                                    prev
                                                                ) + 1
                                                            ).toString()
                                                        )
                                                    }
                                                    className='rounded-r-md bg-gray-700 px-3 py-2 text-white'
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className='mt-2 grid grid-cols-2 gap-2'>
                                                {[1, 2, 5, 10].map(amount => (
                                                    <button
                                                        key={amount}
                                                        onClick={() =>
                                                            setStake(
                                                                amount.toFixed(
                                                                    2
                                                                )
                                                            )
                                                        }
                                                        className='rounded-md bg-gray-600 px-3 py-1 text-white'
                                                    >
                                                        {amount}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {showInit && !isBuy && (
                                            <button
                                                onClick={() => setIsBuy(true)}
                                                className='flex h-full items-center justify-center rounded-md bg-green-600 px-4 py-4 text-lg font-bold uppercase text-black hover:opacity-80'
                                            >
                                                BET {myNewStake}{' '}
                                                {accountInfo.currency}
                                            </button>
                                        )}
                                    </div>

                                    {!showInit && (
                                        <button
                                            onClick={() => {
                                                sendMessage(
                                                    sellContract({
                                                        loginid:
                                                            accountInfo.loginid,
                                                        contract_id:
                                                            trades[0]
                                                                .contract_id,
                                                        price: 0,
                                                        passthrough: {
                                                            is_virtual_hook:
                                                                accountInfo.is_virtual_hook,
                                                        },
                                                    })
                                                )
                                            }}
                                            className='flex h-full w-full items-center justify-center rounded-md bg-orange-600 px-4 py-4 text-lg font-bold uppercase text-white hover:opacity-80 md:w-1/2'
                                        >
                                            CASH OUT{' '}
                                            {String(trades[0].sell_price)}{' '}
                                            {accountInfo.currency}
                                        </button>
                                    )}

                                    {isBuy && (
                                        <button
                                            onClick={() => setIsBuy(false)}
                                            className='flex h-full w-full items-center justify-center rounded-md bg-red-600 px-4 py-4 text-lg font-bold uppercase text-white hover:opacity-80 md:w-1/2'
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <div className='my-4 w-full border-t border-gray-600'></div>

                                <div className='flex w-full flex-col items-center justify-center gap-4 md:flex-row'>
                                    <div className='flex items-center gap-4'>
                                        <label
                                            htmlFor='toggle'
                                            className='text-sm text-white'
                                        >
                                            Auto Bet
                                        </label>
                                        <div className='relative mr-4 inline-block w-10 select-none align-middle transition duration-200 ease-in'>
                                            <input
                                                type='checkbox'
                                                name='toggle'
                                                id='toggle'
                                                checked={isAuto}
                                                onChange={() =>
                                                    setIsAuto(prev => !prev)
                                                }
                                                className='toggle-checkbox sr-only'
                                            />
                                            <label
                                                htmlFor='toggle'
                                                className={`toggle-label block h-5 w-10 cursor-pointer rounded-full transition-colors duration-300 ${
                                                    isAuto
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-300'
                                                } `}
                                            >
                                                <span
                                                    className={`toggle-dot absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                                                        isAuto
                                                            ? 'translate-x-5 transform'
                                                            : ''
                                                    } `}
                                                ></span>
                                            </label>
                                        </div>

                                        <label
                                            htmlFor='toggle-cashout'
                                            className='text-sm text-white'
                                        >
                                            Auto Cash Out
                                        </label>
                                        <div className='relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in'>
                                            <input
                                                type='checkbox'
                                                name='toggle-cashout'
                                                id='toggle-cashout'
                                                checked={isAutoCashOut}
                                                onChange={() =>
                                                    setIsAutoCashOut(
                                                        prev => !prev
                                                    )
                                                }
                                                className='toggle-checkbox sr-only'
                                            />
                                            <label
                                                htmlFor='toggle-cashout'
                                                className={`toggle-label block h-5 w-10 cursor-pointer rounded-full transition-colors duration-300 ${
                                                    isAutoCashOut
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-300'
                                                } `}
                                            >
                                                <span
                                                    className={`toggle-dot absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300 ${
                                                        isAutoCashOut
                                                            ? 'translate-x-5 transform'
                                                            : ''
                                                    } `}
                                                ></span>
                                            </label>
                                        </div>
                                        <input
                                            type='text'
                                            className='ml-2 w-16 rounded-full bg-gray-900 px-3 py-1 text-center text-white'
                                            value={cashoutMultiplier}
                                            onChange={e =>
                                                setCashoutMultiplier(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className='flex flex-col gap-2 py-1'>
                                        {isAdvanceConfig ? (
                                            <button
                                                onClick={() =>
                                                    setIsAdvanceConfig(
                                                        prev => !prev
                                                    )
                                                }
                                                className='w-full rounded bg-red-500 px-3 py-2 text-white hover:opacity-70 md:w-auto'
                                            >
                                                Hide Configure
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setIsAdvanceConfig(
                                                        prev => !prev
                                                    )
                                                }
                                                className='w-full rounded bg-goldAli px-3 py-2 text-black hover:opacity-70 md:w-auto'
                                            >
                                                Show Configure
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {showInit && !isBuy && (
                                <>
                                    {/* stake */}
                                    <div
                                        className={`grid w-full grid-cols-1 gap-3 md:grid-cols-2`}
                                    >
                                        {isAdvanceConfig && (
                                            <>
                                                <div className='flex flex-col md:col-span-2'>
                                                    <label htmlFor='multiplier'>
                                                        Martingale Factor
                                                    </label>
                                                    <input
                                                        className='border border-blue-600 px-3 py-2 dark:border-black dark:bg-gray-900 dark:text-gray-400'
                                                        type='text'
                                                        name='multiplier'
                                                        value={multiplier}
                                                        onChange={e => {
                                                            const multiplier =
                                                                e.currentTarget
                                                                    .value

                                                            setMultiplier(
                                                                prev => {
                                                                    console.log(
                                                                        prev
                                                                    )
                                                                    return multiplier
                                                                }
                                                            )
                                                        }}
                                                        placeholder='Enter  Martingale Factor'
                                                        required
                                                    />
                                                </div>

                                                <div className='flex flex-col'>
                                                    <label htmlFor='take profit'>
                                                        take profit (
                                                        {accountInfo.currency})
                                                    </label>
                                                    <input
                                                        className='border border-blue-600 px-3 py-2 dark:border-black dark:bg-gray-900 dark:text-gray-400'
                                                        type='text'
                                                        name='takeprofit'
                                                        value={tp}
                                                        onChange={e => {
                                                            const tp =
                                                                e.currentTarget
                                                                    .value

                                                            setTp(prev => {
                                                                console.log(
                                                                    prev
                                                                )
                                                                return tp
                                                            })
                                                        }}
                                                        placeholder='Enter Take Profit'
                                                        required
                                                    />
                                                </div>

                                                <div className='flex flex-col'>
                                                    <label htmlFor='stop loss'>
                                                        stop loss (
                                                        {accountInfo.currency})
                                                    </label>
                                                    <input
                                                        className='border border-blue-600 px-3 py-2 dark:border-black dark:bg-gray-900 dark:text-gray-400'
                                                        type='text'
                                                        name='stoploss'
                                                        value={sl}
                                                        onChange={e => {
                                                            const sl =
                                                                e.currentTarget
                                                                    .value

                                                            setSl(prev => {
                                                                console.log(
                                                                    prev
                                                                )
                                                                return sl
                                                            })
                                                        }}
                                                        placeholder='Enter Stop Loss'
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-1 px-1 md:col-span-2 md:px-3'>
                    <div className='mb-3 flex w-full items-center justify-center'>
                        <button
                            className='flex w-auto items-center justify-center gap-2 rounded bg-goldAli px-2 py-1 font-bold text-black hover:bg-opacity-80'
                            onClick={() => {
                                dispatch(deleteTradeHistory())
                                toast.info('Aviator records Reset')
                            }}
                        >
                            <GrPowerReset />
                            <span>Reset</span>
                        </button>
                    </div>

                    <div className='grid w-full grid-cols-2 rounded bg-gray-200 px-1 py-2 text-black dark:bg-blue-950 dark:text-black'>
                        <h3 className='text-center'>Bet USD</h3>
                        <h3 className='text-center'>Cashout USD</h3>
                    </div>

                    {trades
                        .filter(
                            value =>
                                value.contract_type === 'ACCU' &&
                                value.status !== 'Pending'
                        )
                        .map(value => {
                            return (
                                <div
                                    key={value.contract_id}
                                    className={`w-full ${
                                        value.payout > 0
                                            ? 'bg-green-500 dark:bg-green-800'
                                            : 'bg-red-500 dark:bg-red-800'
                                    } flex flex-col items-center justify-center rounded px-1 py-4 text-white`}
                                >
                                    {/* Headings and Values Container */}
                                    <div className='flex w-full items-center justify-between'>
                                        {/* Heading */}
                                        <div className='flex w-1/2 flex-col items-center justify-center'>
                                            <h3 className='font-bold'>Bet</h3>
                                            <h3>{value.buy_price}</h3>
                                        </div>
                                        <div className='flex w-1/2 flex-col items-center justify-center'>
                                            <h3 className='font-bold'>
                                                Cashout
                                            </h3>
                                            <h3>{value.payout}</h3>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
            <div className='h-12'></div>
            <BottomNav token={token} />
        </>
    )
}

const ProgressBar = ({ myCount }: { myCount: number }) => {
    const [count, setCount] = useState(myCount)

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [count])

    const progressPercentage = (count / myCount) * 100
    const progressColor = 'orange'

    return (
        <div className='h-8 w-full items-center justify-center rounded bg-green-600'>
            <div
                className='flex h-8 items-center justify-center rounded text-white'
                style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: progressColor,
                    transition:
                        'width 1s ease-out, background-color 1s ease-out',
                }}
            >
                {count > 0 && `${count}s`}
            </div>
        </div>
    )
}

export default Aviator

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
