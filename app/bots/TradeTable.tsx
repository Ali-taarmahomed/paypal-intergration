// TradeTable.tsx

'use client'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import { FaTableCells } from 'react-icons/fa6'
import { CiGrid41 } from 'react-icons/ci'
import { MyTable } from '@/components/MyTable'
import { useState } from 'react'
import { DerivTradeState } from '@/state/trades/tradeHistorySlice'

export const TradeTable = () => {
    const tradeData = useSelector((state: RootState) => state.trades)
    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const [isTable, setIsTable] = useState(false)

    const filteredData = []
    let i = 1
    for (const value of tradeData) {
        filteredData.push({
            '#': i,
            asset: value.asset,
            contract_type: value.contract_type,
            buy_price: `${value.buy_price} ${accountInfo.currency}`,
            payout: `${value.payout} ${accountInfo.currency}`,
            status:
                value.status === 'Won' ? (
                    <span className='rounded bg-green-500 px-2 py-1 text-xs text-white'>
                        {value.status}
                    </span>
                ) : value.status === 'Lost' ? (
                    <span className='rounded bg-red-500 px-2 py-1 text-xs text-white'>
                        {value.status}
                    </span>
                ) : (
                    <span className='rounded bg-yellow-500 px-2 py-1 text-xs text-white'>
                        {value.status}
                    </span>
                ),
        })
        i++
    }

    // Remove init state
    if (filteredData.length > 1) {
        filteredData.pop()
    }

    return (
        <div className='mb-20 flex w-full flex-col gap-2 px-3 md:px-8'>
            <div className='flex w-full flex-col items-center gap-1'>
                <span className='font-bold text-goldAli'>Toggle View</span>
                <button
                    className='flex items-center justify-center gap-3 rounded bg-goldAli px-3 py-1 font-bold text-black hover:bg-goldAli'
                    onClick={() => {
                        setIsTable(prev => !prev)
                    }}
                >
                    {isTable ? <CiGrid41 /> : <FaTableCells />}
                    <span>{isTable ? 'Card' : 'Table'}</span>
                </button>
            </div>

            <div
                className={`container mx-auto mt-4 max-h-[80vh] min-h-[50vh] overflow-y-auto rounded-lg border border-goldAli bg-[#1A1B25] p-4`}
            >
                {tradeData[0].entry_tick === '#' && tradeData.length === 1 ? (
                    <div className='flex items-center justify-center px-3 py-2 text-lg font-bold text-goldAli'>
                        No Open Trades
                    </div>
                ) : isTable ? (
                    <MyTable title={'Trade History'} data={filteredData} />
                ) : (
                    <CardTable tradeData={tradeData} />
                )}
            </div>
        </div>
    )
}

const CardTable = ({ tradeData }: { tradeData: DerivTradeState[] }) => {
    const filteredData = []
    let i = 1
    for (const value of tradeData) {
        filteredData.push({
            '#': i,
            asset: value.asset,
            contract_type: value.contract_type,
            entry_tick: String(value.entry_tick),
            exit_tick: String(value.exit_tick),
            buy_price: `${value.buy_price}`,
            payout: `${value.payout}`,
            profit: String(value.profit),
            status: value.status,
            contract_id: value.contract_id,
        })
        i++
    }

    // Remove init state
    if (filteredData.length > 1) {
        filteredData.pop()
    }

    return filteredData.map(value => {
        return (
            <div
                key={value.contract_id}
                className='grid w-full grid-cols-2 items-center justify-center gap-2 rounded bg-[#141A26] p-3 px-3'
            >
                <div className='col-span-2 text-goldAli'>
                    {value.asset} ({value.contract_type})
                </div>

                <div className='grid grid-cols-1 gap-1'>
                    <div className='text-gray-500'>{value.entry_tick}</div>
                    <div className='text-blueAli'>
                        {value.status === 'Pending' ? '--' : value.exit_tick}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-1'>
                    <div className='text-white'>Stake</div>
                    <div className='text-center text-white'>
                        {value.buy_price}
                    </div>

                    <div className='text-white'>Payout</div>
                    <div className='text-center'>
                        {value.status === 'Won' ? (
                            <span className='text-green-500'>
                                {value.payout}
                            </span>
                        ) : value.status === 'Lost' ? (
                            <span className='text-red-500'>{value.payout}</span>
                        ) : (
                            '--'
                        )}
                    </div>
                </div>
            </div>
        )
    })
}
