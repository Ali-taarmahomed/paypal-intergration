'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { isValidLogin } from '../lib'
import { AdminBalance, AdminHeader, InvalidLogin } from '../Components'
import { useDerivAccount } from '@/hooks/useDerivAccount'
import { saveAccounts } from '@/state/userAccounts/userAccountsSlice'
import { Loading } from '@/components/Loading'
import {
    AdminTransactionSummary,
    adminTransactionSummary,
} from '@/modules/cashier/action'
import { FaMoneyCheckAlt, FaWallet, FaDollarSign } from 'react-icons/fa'

export const AdminDashboard = () => {
    const myDerivAccounts = useDerivAccount()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(saveAccounts(myDerivAccounts))
    }, [myDerivAccounts, dispatch])

    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const { signature, token } = useGetQueryParams()
    const [myData, setMyData] = useState<AdminTransactionSummary[]>([])
    const [refetchInterval, setRefetchInterval] = useState(2000)

    useEffect(() => {
        const fn = async () => {
            const data: any = await adminTransactionSummary()

            console.table(data)
            setMyData([data])
        }

        fn()
        const intervalId = setInterval(() => {
            setRefetchInterval(prev => {
                if (prev === 2000) return 1000 * 60 * 60
                return 2000
            })
        }, refetchInterval)

        return () => {
            clearInterval(intervalId)
        }
    }, [refetchInterval])

    if (myDerivAccounts[0]?.token === '') {
        return <Loading />
    }

    if (
        !isValidLogin(
            { email: accountInfo.email, loginId: accountInfo.loginid },
            signature
        )
    )
        return <InvalidLogin />

    return (
        <div className='flex flex-col'>
            <AdminHeader token={token} signature={signature} />
            <AdminBalance />

            {myData.length == 0 ? (
                <>Loading Summary</>
            ) : (
                <>
                    {(() => {
                        const currentData = myData[0]
                        const { deposits, withdrawals, totalFees } = currentData

                        return (
                            <div className='grid grid-cols-1 gap-4 p-6 md:grid-cols-3'>
                                <AdminCard
                                    title='Total Deposits'
                                    amountBeforeFees={deposits.initial}
                                    fees={deposits.fee}
                                    amountAfterFees={deposits.final}
                                    icon={<FaMoneyCheckAlt />}
                                />
                                <AdminCard
                                    title='Total Withdrawals'
                                    amountBeforeFees={withdrawals.initial}
                                    fees={withdrawals.fee}
                                    amountAfterFees={withdrawals.final}
                                    icon={<FaWallet />}
                                />
                                <div className='w-full rounded-lg border border-gray-200 bg-white p-6 shadow-lg'>
                                    <div className='flex items-center gap-3'>
                                        <div className='text-3xl text-blue-600'>
                                            <FaDollarSign />
                                        </div>
                                        <h3 className='text-lg font-semibold text-gray-700'>
                                            Total Fees Collected
                                        </h3>
                                    </div>
                                    <div className='mt-4 text-center text-gray-600'>
                                        <p className='text-2xl font-bold text-red-500'>
                                            ${totalFees}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </>
            )}
        </div>
    )
}

interface AdminCardProps {
    title: string
    amountBeforeFees: number
    fees: number
    amountAfterFees: number
    icon: JSX.Element
}

const AdminCard = ({
    title,
    amountBeforeFees,
    fees,
    amountAfterFees,
    icon,
}: AdminCardProps) => {
    return (
        <div className='w-full rounded-lg border border-gray-200 bg-white p-6 shadow-lg'>
            <div className='flex items-center gap-3'>
                <div className='text-3xl text-blue-600'>{icon}</div>
                <h3 className='text-lg font-semibold text-gray-700'>{title}</h3>
            </div>
            <div className='mt-4 space-y-2 text-gray-600'>
                <p className='flex justify-between'>
                    <span>Before Fees:</span>{' '}
                    <span className='font-semibold'>
                        ${amountBeforeFees.toFixed(2)}
                    </span>
                </p>
                <p className='flex justify-between'>
                    <span>Fees:</span>{' '}
                    <span className='font-semibold text-red-500'>
                        -${fees.toFixed(2)}
                    </span>
                </p>
                <p className='flex justify-between'>
                    <span>After Fees:</span>{' '}
                    <span className='font-semibold text-green-600'>
                        ${amountAfterFees.toFixed(2)}
                    </span>
                </p>
            </div>
        </div>
    )
}
