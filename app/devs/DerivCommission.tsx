'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import { MonthlyChart } from './MonthlyChart/MonthlyChart'
import { toast } from 'react-toastify'
import { MarkupState } from '@/state/markups/markupsSlice'

export const DerivCommission = ({
    sendMessage,
}: {
    sendMessage: (
        message: Record<string, string | number | boolean | unknown>
    ) => void
}) => {
    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const { selectedAppId, setSelectedAppId, appIds, newMarkup } =
        useCommissionSummary()
    const [startDate, setStartDate] = useState<string>('')
    const [stopDate, setStopDate] = useState<string>('')

    useEffect(() => {
        const dateObj = new Date()
        const year = dateObj.getUTCFullYear()
        const month = dateObj.getUTCMonth() + 1
        const day = dateObj.getUTCDate()

        //today commission
        const today = startToEndDates({
            start: { year: year, month: month, day: day },
            end: { year: year, month: month, day: day },
            type: 'Today',
        })

        sendMessage({
            app_markup_statistics: 1,
            date_from: today.startDate,
            date_to: today.endDate,
            loginid: accountInfo.loginid,
            passthrough: {
                is_virtual_hook: accountInfo.is_virtual_hook,
                yearMonthDay: today.yearMonthDay,
                month: today.month,
                name: today.name,
                type: today.type,
                yyyymmdd: today.yyyymmdd,
            },
        })

        //get commissions for last x=12 months
        const dates = getLastXMonths(11)
        for (const item of dates) {
            sendMessage({
                app_markup_statistics: 1,
                date_from: item.startDate,
                date_to: item.endDate,
                loginid: accountInfo.loginid,
                passthrough: {
                    is_virtual_hook: accountInfo.is_virtual_hook,
                    yearMonthDay: item.yearMonthDay,
                    month: item.month,
                    name: item.name,
                    type: item.type,
                    yyyymmdd: item.yyyymmdd,
                },
            })
        }
    }, [])

    const handleClick = () => {
        const start = startDate.split(' ')[0].split('-')
        const end = stopDate.split(' ')[0].split('-')

        const custom = startToEndDates({
            start: {
                year: parseInt(start[0]),
                month: parseInt(start[1]),
                day: parseInt(start[2]),
            },
            end: {
                year: parseInt(end[0]),
                month: parseInt(end[1]),
                day: parseInt(end[2]),
            },
            type: `Custom-${startDate}-${stopDate}`,
        })

        sendMessage({
            app_markup_statistics: 1,
            date_from: custom.startDate,
            date_to: custom.endDate,
            loginid: accountInfo.loginid,
            passthrough: {
                is_virtual_hook: accountInfo.is_virtual_hook,
                yearMonthDay: custom.yearMonthDay,
                month: custom.month,
                name: custom.name,
                type: custom.type,
                yyyymmdd: custom.yyyymmdd,
            },
        })
    }

    return (
        <div className='mb-8 flex flex-col items-center justify-center gap-4 px-1 py-2 md:px-4'>
            <h1 className='py-2 text-center text-lg font-bold uppercase md:py-4 md:text-3xl'>
                Developers Commissions
            </h1>
            <DerivMonthCommissions
                selectedAppId={selectedAppId}
                setSelectedAppId={setSelectedAppId}
                appIds={appIds}
                newMarkup={newMarkup}
            />
            <MonthlyChart newMarkup={newMarkup} />

            <div className='grid w-full grid-cols-1 gap-4 rounded-lg bg-gray-200 px-4 py-8 shadow-lg md:grid-cols-2'>
                <div className='py-2 text-center text-2xl font-bold uppercase md:col-span-2'>
                    Custom Range Commission
                </div>
                <div className='flex w-full flex-col gap-1'>
                    <label className='px-3' htmlFor='startDate'>
                        Start Date
                    </label>
                    <input
                        className='w-full border border-blue-600 px-3 py-2'
                        type='date'
                        onChange={e => {
                            const myDate = e.currentTarget.value

                            if (myDate !== null) {
                                setStartDate(prev => {
                                    console.log(prev)
                                    return myDate
                                })
                            }
                        }}
                        name='startDate'
                        id=''
                    />
                </div>
                <div className='flex w-full flex-col gap-1'>
                    <label className='px-3' htmlFor='stopDate'>
                        Stop Date
                    </label>
                    <input
                        className='w-full border border-blue-600 px-3 py-2'
                        type='date'
                        onChange={e => {
                            const myDate = e.currentTarget.value

                            if (myDate !== null) {
                                setStopDate(prev => {
                                    console.log(prev)
                                    return myDate
                                })
                            }
                        }}
                        name='stopDate'
                        id=''
                    />
                </div>

                <div className='md:col-span-2'>
                    <button
                        onClick={() => {
                            if (startDate === '' || stopDate === '') {
                                toast.error('No date Range Provided')
                            } else {
                                handleClick()
                                toast.success(
                                    'Commission Calculated,Scroll To The top To view'
                                )
                            }
                        }}
                        className='w-full rounded bg-blue-600 px-3 py-2 uppercase text-white hover:bg-black'
                    >
                        Calculate
                    </button>
                </div>
            </div>
        </div>
    )
}

const DerivMonthCommissions = ({
    selectedAppId,
    setSelectedAppId,
    appIds,
    newMarkup,
}: {
    selectedAppId: string
    setSelectedAppId: Dispatch<SetStateAction<string>>
    appIds: string[]
    newMarkup: MarkupState[]
}) => {
    const dateObj = new Date()
    // const year = dateObj.getUTCFullYear()
    const month = dateObj.getUTCMonth() + 1
    // const day = dateObj.getUTCDate()
    return (
        <div className='grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
            <div className='flex w-full items-center justify-center gap-2 md:col-span-2 lg:col-span-3'>
                <label htmlFor=''>AppID</label>
                <select
                    className='px-1 py-2 md:px-3'
                    onChange={e => {
                        const currentAppId = e.currentTarget.value
                        setSelectedAppId(prevData => {
                            prevData = currentAppId
                            return prevData
                        })
                    }}
                >
                    {appIds.map(value => {
                        if (value === selectedAppId) {
                            return (
                                <option
                                    selected
                                    key={String(value)}
                                    defaultValue={value}
                                    value={value}
                                >
                                    {String(value).toLocaleUpperCase()}
                                </option>
                            )
                        }
                        return (
                            <option key={String(value)} value={value}>
                                {String(value).toLocaleUpperCase()}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* this recent two months commission */}
            {newMarkup
                .sort((a, b) => b.yyyymmdd - a.yyyymmdd)
                .filter(
                    value =>
                        value.type == 'Monthly' &&
                        (value.month == month ||
                            value.month == (month - 1 == 0 ? 12 : month - 1))
                )
                .map((value, index) => {
                    return (
                        <div
                            key={index}
                            className='flex w-full flex-col gap-1 rounded-lg bg-gray-200 px-8 py-6 shadow-lg'
                        >
                            <p className='text-lg'>
                                {value.type == 'Today'
                                    ? `Today's`
                                    : `${value.name}'s`}{' '}
                                Commission
                            </p>

                            <h2 className='text-xl font-bold md:text-3xl'>
                                {Math.floor(value.markupAmount * 100) / 100}{' '}
                                {value.currency}
                            </h2>

                            <p className='text-green-500'>
                                {value.totalTrades} Trades
                            </p>
                            {/* <p>{value.appId}</p> */}
                            {/* <p>{value.type}</p> */}
                        </div>
                    )
                })}

            {/* today commission */}
            {newMarkup
                .filter(value => value.type == 'Today')
                .map((value, index) => {
                    return (
                        <div
                            key={index}
                            className='flex w-full flex-col gap-1 rounded-lg bg-gray-200 px-8 py-6 shadow-lg'
                        >
                            <p className='text-lg'>
                                {value.type == 'Today'
                                    ? `Today's`
                                    : `${value.name}'s`}{' '}
                                Commission
                            </p>

                            <h2 className='text-xl font-bold md:text-3xl'>
                                {Math.floor(value.markupAmount * 100) / 100}{' '}
                                {value.currency}
                            </h2>

                            <p className='text-green-500'>
                                {value.totalTrades} Trades
                            </p>
                            {/* <p>{value.appId}</p> */}
                            {/* <p>{value.type}</p> */}
                        </div>
                    )
                })}

            {/* custom commission */}
            {newMarkup
                .filter(value => value.type.slice(0, 1) == 'C')
                .map((value, index) => {
                    return (
                        <div
                            key={index}
                            className='flex w-full flex-col gap-1 rounded-lg bg-gray-200 px-8 py-6 shadow-lg'
                        >
                            <p className='text-lg'>
                                {value.yearMonthDay} Commission
                            </p>

                            <h2 className='text-xl font-bold md:text-3xl'>
                                {Math.floor(value.markupAmount * 100) / 100}{' '}
                                {value.currency}
                            </h2>

                            <p className='text-green-500'>
                                {value.totalTrades} Trades
                            </p>
                            {/* <p>{value.appId}</p> */}
                            {/* <p>{value.type}</p> */}
                        </div>
                    )
                })}
        </div>
    )

    // return (
    //     <div
    //         key={''}
    //         className='w-full rounded-lg shadow-lg  bg-gray-200 flex flex-col gap-1 py-6 px-8'
    //     >
    //         <p className='text-lg'>{'October'} Commission</p>

    //         <h2 className='font-bold text-xl md:text-3xl'>0 {'USD'}</h2>
    //     </div>
    // )
}

const useAppIds = () => {
    const markups = useSelector((state: RootState) => state.markups)

    const appIds: string[] = []

    for (const item of markups) {
        if (!appIds.includes(item.appId)) {
            appIds.push(item.appId)
        }
    }
    return { appIds }
}

function useCommissionSummary() {
    const { appIds: appIdArr } = useAppIds()

    const appIds = appIdArr.filter(value => value != '')

    const markups = useSelector((state: RootState) => state.markups)
    const [selectedAppId, setSelectedAppId] = useState(markups[0].appId)

    useEffect(() => {
        setSelectedAppId(appIds[0])
    }, [appIds.length])

    const newMarkup = (
        selectedAppId === ''
            ? markups
            : markups.filter(value => value.appId == selectedAppId)
    )
        .filter(value => !(value.appId == '0' || value.appId == ''))
        .sort((a, b) => a.yyyymmdd - b.yyyymmdd)

    return {
        selectedAppId,
        setSelectedAppId,
        appIds,
        newMarkup,
    }
}

function getMonthName(month: number) {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    return monthNames[month - 1]
}

function getEndMonthDay(month: number, year: number) {
    const daysOfMonths = [
        31,
        year % 4 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ]
    return daysOfMonths[month - 1]
}

function getLastXMonths(totalMonthsSummary: number) {
    const totalMonths =
        totalMonthsSummary <= 0
            ? 1
            : totalMonthsSummary > 12
              ? 12
              : totalMonthsSummary
    const dateObj = new Date()
    const year = dateObj.getUTCFullYear()
    const month = dateObj.getUTCMonth() + 1
    // const date = dateObj.getUTCDate()

    let firstMonth = month - totalMonths
    const firstyear = firstMonth < 0 ? year - 1 : year
    firstMonth = 12 - Math.abs(firstMonth)

    const dates: {
        startDate: string
        endDate: string
        yearMonthDay: string
        month: number
        name: string
        type: string
        yyyymmdd: number
    }[] = []

    if (firstyear < year) {
        for (let i = firstMonth; i <= 12; i++) {
            const endDate = getEndMonthDay(i, firstyear)
            dates.push(
                startToEndDates({
                    start: { year: firstyear, month: i, day: 1 },
                    end: { year: firstyear, month: i, day: endDate },
                    type: 'Monthly',
                })
            )
        }
    }

    //curent year
    for (
        let i = month > totalMonths ? month - totalMonths : 1;
        i <= month;
        i++
    ) {
        const endDate = getEndMonthDay(i, year)
        dates.push(
            startToEndDates({
                start: { year: year, month: i, day: 1 },
                end: { year: year, month: i, day: endDate },
                type: 'Monthly',
            })
        )
    }

    return dates
}

type DateFormatT = { year: number; month: number; day: number }
type StartEndDatesT = { start: DateFormatT; end: DateFormatT; type: string }

function startToEndDates({ start, end, type }: StartEndDatesT) {
    return {
        startDate: `${start.year}-${start.month}-${start.day} 00:00:00`,
        endDate: `${end.year}-${end.month}-${end.day} 23:59:59`,
        yearMonthDay: `${start.year}-${start.month}-${start.day} to ${end.year}-${end.month}-${end.day}`,
        month: start.month,
        name: getMonthName(start.month),
        type: type,
        yyyymmdd: parseInt(
            `${start.year}${
                String(start.month).length === 1
                    ? `0${start.month}`
                    : start.month
            }${String(start.day).length === 1 ? `0${start.day}` : start.day}`
        ),
    }
}
