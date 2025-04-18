'use client'

import React, { Suspense, useEffect } from 'react'
import { useDerivAccount } from '@/hooks/useDerivAccount'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/state/store'
import { saveAccounts } from '@/state/userAccounts/userAccountsSlice'
import { Loading } from '@/components/Loading'
import NavBar from '../bots/NavBar'
import { useGetLastVisitedPath } from '@/hooks/useCleanPath'
import { Header } from '@/components/Header'

const Page = () => {
    return (
        <Suspense fallback={<Loading />}>
            <DerivAccounts />
        </Suspense>
    )
}

const DerivAccounts = () => {
    const lastPath = useGetLastVisitedPath()
    const myDerivAccounts = useDerivAccount()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(saveAccounts(myDerivAccounts))
    }, [myDerivAccounts, dispatch])

    if (myDerivAccounts[0]?.token === '') {
        return <Loading />
    }
    
    const token = myDerivAccounts[0].token

    const getAccountStatus = (code: string): string => {
        if (code.startsWith('CR')) return 'Real Account'
        if (code.startsWith('VRT')) return 'Demo Account'
        if (code.toLowerCase().includes('token')) return 'API Token'
        return 'Unknown'
    }

    return (
        <>
            {/* NavBar Integration */}
            <Header token={token} />

            <div className='flex min-h-screen flex-col items-center bg-[#1A1B25] text-gray-300'>
                {/* Header Section */}
                <header className='mt-8 px-4 text-center'>
                    <h1 className='mb-4 text-4xl font-bold text-goldAli'>
                        Select an Account
                    </h1>
                    <p className='text-lg leading-relaxed text-gray-300'>
                        Please choose the account you want to trade on. Later,
                        you can switch accounts by{' '}
                        <span className='font-bold text-goldAli'>
                            your trade balance
                        </span>{' '}
                        in the top-right corner of the next screen.
                    </p>
                </header>

                {/* Account Grid Section */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-${
                        myDerivAccounts.length >= 3 ? 3 : myDerivAccounts.length
                    } mt-10 w-full max-w-5xl gap-6 px-4`}
                >
                    {myDerivAccounts.map(account => {
                        const myLastPath = lastPath == null ? '/bots' : lastPath
                        const url = `${myLastPath}?token=${account.token}`
                        const accountStatus = getAccountStatus(account.code)
                        return (
                            <Link
                                key={account.code}
                                href={url}
                                className='account-card flex transform flex-col items-center justify-center rounded-2xl border border-goldAli bg-[#141A26] p-6 text-goldAli shadow-lg transition-transform hover:scale-105 hover:bg-goldAli hover:text-[#1A1B25]'
                            >
                                <div className='relative w-full text-center'>
                                    <h2 className='text-xl font-bold'>
                                        {account.code}
                                    </h2>
                                    <span
                                        className={`badge absolute right-4 top-0 ${
                                            accountStatus === 'Real Account'
                                                ? 'bg-green-500'
                                                : accountStatus ===
                                                    'Demo Account'
                                                  ? 'bg-red-500'
                                                  : 'bg-gray-500'
                                        }`}
                                    >
                                        {accountStatus}
                                    </span>
                                </div>
                                <p className='text-lg'>{account.currency}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Styling */}
            <style jsx>{`
                .account-card {
                    text-align: center;
                    transition: all 0.3s ease-in-out;
                }

                .account-card:hover {
                    background-color: #ff9f1c; /* Gold background */
                }

                .account-card:hover h2,
                .account-card:hover p {
                    color: #1a1b25; /* Ensure all text inverts on hover */
                }

                h2,
                p {
                    transition: color 0.3s ease-in-out; /* Smooth color transition for text */
                }

                .badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    color: #fff;
                }

                .bg-green-500 {
                    background-color: #22c55e; /* Green for Real Account */
                }

                .bg-red-500 {
                    background-color: #ef4444; /* Red for Demo Account */
                }

                .bg-gray-500 {
                    background-color: #6b7280; /* Neutral for API Token */
                }

                .pt-20 {
                    padding-top: 5rem; /* Pushes content down to avoid overlap with NavBar */
                }
            `}</style>
        </>
    )
}

export default Page
