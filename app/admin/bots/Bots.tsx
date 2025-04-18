'use client'
import {
    confirmBotPurchase,
    getbotsAll,
    declineBotPurchase,
    revokeBotAccess,
} from '@/app/bots/actions'
import { botsList } from '@/app/bots/botsList'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { convertCurrency } from '@/lib/currency-converter'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { isValidLogin } from '../lib'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { AdminBalance, AdminHeader, InvalidLogin } from '../Components'

const AdminMenu = ['pending-bots', 'active bots', 'expired-bots', 'all-bots']

export const Bots = () => {
    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const { signature, token } = useGetQueryParams()

    const [currentSelect, setCurrentSelect] = useState(AdminMenu[0])
    const [allBoughtBots, setAllBoughtBots] = useState<
        {
            id: string
            email: string
            loginId: string
            botName: string
            amountInUSD: unknown
            confirmationCode: string
            isConfirmed: boolean
            isDeclined: boolean // Track declined state
            subscriptionDays: number
            isValid: boolean
            createdAt: Date
        }[]
    >()

    const [exchangeRate, setExchangeRate] = useState(0)

    useEffect(() => {
        const fn = async () => {
            const rate = await convertCurrency(1, 'USD', 'ZAR')
            setExchangeRate(prev => {
                console.log(prev)
                return rate
            })
        }

        fn()
    }, [])

    useEffect(() => {
        const fn = async () => {
            const res: {
                id: string
                email: string
                loginId: string
                botName: string
                amountInUSD: unknown
                confirmationCode: string
                isConfirmed: boolean
                isDeclined: boolean // Add this line
                subscriptionDays: number
                isValid: boolean
                createdAt: Date
                updatedAt: Date
            }[] = await getbotsAll()
            setAllBoughtBots(prev => {
                console.log(prev)
                return res
            })
        }
        fn()
    }, [])

    if (
        !isValidLogin(
            { email: accountInfo.email, loginId: accountInfo.loginid },
            signature
        )
    )
        return <InvalidLogin />

    const handleDecline = async (id: string) => {
        const { isAdded, reason } = await declineBotPurchase({ id })

        if (isAdded) {
            // Update the state to remove the declined bot from the pending list
            setAllBoughtBots(prev => prev?.filter(bot => bot.id !== id))
            toast.success(reason)
        } else {
            toast.error(reason)
        }
    }

    return (
        <>
            <AdminHeader token={token} signature={signature} />
            <AdminBalance />

            <div className='grid w-full grid-cols-4 gap-2 px-3 py-6'>
                {AdminMenu.map(value => {
                    return (
                        <div
                            key={value}
                            className='flex items-center justify-center'
                        >
                            {currentSelect === value ? (
                                <button
                                    className='w-full rounded-lg bg-goldAli px-4 py-2 font-bold text-white hover:bg-goldAli md:py-4'
                                    onClick={() => {
                                        setCurrentSelect(value)
                                    }}
                                >
                                    {value}
                                </button>
                            ) : (
                                <button
                                    className='w-full rounded-lg bg-blueAli px-4 py-2 font-bold text-white hover:bg-blueAli md:py-4'
                                    onClick={() => {
                                        setCurrentSelect(value)
                                    }}
                                >
                                    {value}
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className='grid w-full grid-cols-1 gap-4 px-3 py-8 md:grid-cols-4'>
                {currentSelect === AdminMenu[0] && (
                    <>
                        {allBoughtBots
                            ?.filter(
                                value => !value.isConfirmed && !value.isDeclined
                            ) // Exclude declined bots
                            .map(value => {
                                return (
                                    <div
                                        key={value.id}
                                        className='flex flex-col gap-2 rounded-lg bg-gray-200 px-4 py-8'
                                    >
                                        <h2 className='text-center text-lg font-bold text-blueAli'>
                                            Bot {value.botName}
                                        </h2>
                                        <p>Email :{value.email}</p>
                                        <p>
                                            Amount :{' '}
                                            {` R${
                                                Math.floor(
                                                    (value.amountInUSD as number) *
                                                        exchangeRate *
                                                        100
                                                ) / 100
                                            }/pm`}
                                        </p>

                                        <p>
                                            Order Code :{value.confirmationCode}
                                        </p>

                                        <div className='flex items-center justify-center gap-4'>
                                            <button
                                                className='w-full rounded-lg bg-green-600 px-4 py-3 text-center font-bold uppercase text-white hover:bg-green-950'
                                                onClick={async () => {
                                                    const { isAdded, reason } =
                                                        await confirmBotPurchase(
                                                            { id: value.id }
                                                        )

                                                    if (isAdded) {
                                                        toast.success(reason)
                                                    } else {
                                                        toast.error(reason)
                                                    }
                                                }}
                                            >
                                                Approve Bot
                                            </button>
                                            <button
                                                className='w-full rounded-lg bg-red-600 px-4 py-3 text-center font-bold uppercase text-white hover:bg-red-950'
                                                onClick={() =>
                                                    handleDecline(value.id)
                                                } // Call handleDecline function
                                            >
                                                Decline Bot
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                    </>
                )}

                {currentSelect === AdminMenu[1] && (
                    <>
                        {allBoughtBots
                            ?.filter(
                                value => value.isConfirmed && value.isValid
                            )
                            .map(value => {
                                return (
                                    <div
                                        key={value.id}
                                        className='flex flex-col gap-2 rounded-lg bg-gray-200 px-4 py-8'
                                    >
                                        <h2 className='text-center text-lg font-bold text-blueAli'>
                                            Bot {value.botName}
                                        </h2>
                                        <p>Email :{value.email}</p>
                                        <p>
                                            Amount :{' '}
                                            {` R${
                                                Math.floor(
                                                    (value.amountInUSD as number) *
                                                        exchangeRate *
                                                        100
                                                ) / 100
                                            }/pm`}
                                        </p>

                                        <p>
                                            Order Code :{value.confirmationCode}
                                        </p>
                                        <div className='flex items-center justify-center gap-4'>
                                            <button
                                                className='w-full rounded-lg bg-red-600 px-4 py-3 text-center font-bold uppercase text-white hover:bg-red-950'
                                                onClick={async () => {
                                                    const {
                                                        isRevoked,
                                                        reason,
                                                    } = await revokeBotAccess({
                                                        id: value.id,
                                                    })

                                                    if (isRevoked) {
                                                        toast.success(reason)
                                                    } else {
                                                        toast.error(reason)
                                                    }
                                                }}
                                            >
                                                Revoke Access
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                    </>
                )}
                {currentSelect === AdminMenu[2] && (
                    <>
                        {allBoughtBots
                            ?.filter(
                                value => value.isConfirmed && !value.isValid
                            )
                            .map(value => {
                                return (
                                    <div
                                        key={value.id}
                                        className='flex flex-col gap-2 rounded-lg bg-gray-200 px-4 py-8'
                                    >
                                        <h2 className='text-center text-lg font-bold text-blueAli'>
                                            Bot {value.botName}
                                        </h2>
                                        <p>Email :{value.email}</p>
                                        <p>
                                            Amount :{' '}
                                            {` R${
                                                Math.floor(
                                                    (value.amountInUSD as number) *
                                                        exchangeRate *
                                                        100
                                                ) / 100
                                            }/pm`}
                                        </p>

                                        <p>
                                            Order Code :{value.confirmationCode}
                                        </p>
                                    </div>
                                )
                            })}
                    </>
                )}

                {currentSelect === AdminMenu[3] && (
                    <>
                        {' '}
                        {botsList.map(value => {
                            return (
                                <div
                                    key={value.name}
                                    className='flex flex-col gap-3 rounded-lg bg-gray-200 px-3 py-6 shadow-lg'
                                >
                                    <h2 className='text-lg font-bold'>
                                        {value.name}
                                    </h2>
                                    <ul>
                                        {value.summary.map(value => {
                                            return <li key={value}>{value}</li>
                                        })}
                                    </ul>

                                    <p>
                                        Amount :
                                        {` R${
                                            Math.floor(
                                                (value.amountInUSD as number) *
                                                    exchangeRate *
                                                    100
                                            ) / 100
                                        }/pm`}
                                    </p>
                                </div>
                            )
                        })}
                    </>
                )}
            </div>
        </>
    )
}
