'use client'
import { useDerivWs } from '@/hooks/useDerivWs'
import React from 'react'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Loading } from '@/components/Loading'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { DerivCommission } from './DerivCommission'
import NavBar from '../bots/NavBar'

export const DerivWs = () => {
    const params = useGetQueryParams()
    let { token } = params
    const accountInfo = useSelector((state: RootState) => state.accounts)

    if (token === undefined || token === null) {
        token = accountInfo.token
    }

    const { isReady, sendMessage } = useDerivWs({ token })

    if (token === undefined || token === null || token === '') {
        return (
            <div className='flex h-screen w-full items-center justify-center'>
                <Link
                    className='bg-blue-950 px-3 py-2 text-white hover:opacity-80'
                    href={`/login`}
                >
                    Click To login
                </Link>
            </div>
        )
    }

    if (!isReady) {
        return <Loading />
    }

    // admin logins
    const adminEmail = 'admin@dollartradeclub.com'
    const { password } = params

    if (password !== '@Alitm786' || password == undefined) {
        return (
            <div className='flex h-screen w-full items-center justify-center px-4'>
                <div className='flex w-full flex-col items-center justify-center gap-5 rounded-lg bg-gray-200 px-6 py-16 shadow-lg md:w-1/2 lg:w-1/3'>
                    <h1 className='pb-2 text-xl font-bold uppercase text-blueAli'>
                        DollarTradeClub Developers Admin
                    </h1>
                    <p className='text-sm italic text-gray-400'>
                        If you are not a DTC Developer, please return to the
                        client pages. This page is restricted to developers of
                        DTC only.
                    </p>
                    <form
                        className='flex w-full flex-col items-center justify-start gap-4 px-2 md:px-4'
                        action=''
                    >
                        {/* Hidden Email Field */}
                        <input
                            type='hidden'
                            name='email'
                            defaultValue={adminEmail}
                        />

                        <div className='flex w-full flex-col gap-1'>
                            <label className='pl-2' htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='rounded-lg border border-goldAli px-3 py-2 text-blueAli md:py-4'
                                type='password'
                                name='password'
                                placeholder='Enter password'
                                required
                            />
                        </div>

                        <input
                            type='hidden'
                            name='token'
                            defaultValue={token}
                        />
                        <div className='w-full items-center'>
                            <button
                                className='w-full rounded-lg bg-blueAli px-4 py-2 font-bold text-white hover:bg-blueAli md:py-4'
                                type='submit'
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    if (!isReady) {
        return <Loading />
    }

    return (
        <>
            <NavBar params={params} />
            <DerivCommission sendMessage={sendMessage} />
        </>
    )
}
