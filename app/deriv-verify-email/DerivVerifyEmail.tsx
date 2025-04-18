'use client'
import Loader from '@/components/Loader'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { useDerivWs } from '@/hooks/useDerivWs'

export const DerivVerifyEmail = () => {
    const { action, code, loginid } = useGetQueryParams() //action should be payment_withdraw
    const withdrawData = useSelector((state: RootState) => state.withdrawData)
    const { sendMessage, isReady, getTicks } = useDerivWs({
        token: withdrawData.token,
    })

    const currentTimeStamp = Date.now()

    if (
        action === undefined ||
        action === null ||
        code === undefined ||
        code === null ||
        loginid === undefined ||
        loginid === null
    ) {
        return <Loader />
    }

    if (
        withdrawData.token == '' ||
        withdrawData.timeStamp == 0 ||
        currentTimeStamp > withdrawData.timeStamp
    )
        return (
            <div className='flex h-screen w-screen items-center justify-center px-2'>
                <div className='w-full rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-lg md:w-[60%]'>
                    <h1 className='mb-4 py-4 text-center text-4xl font-semibold text-goldAli'>
                        Verify your withdrawal request
                    </h1>

                    <div className='mb-8 text-center'>
                        <h2 className='py-2 text-lg font-bold'>Hi Trader</h2>
                        <p>
                            Before we can process your withdrawal, we first need
                            to check that it was you who made the request.
                        </p>

                        <p>
                            Enter the following verification token into the
                            form:
                        </p>

                        <h3 className='my-8 rounded-lg bg-gray-200 px-3 py-2 text-center text-2xl text-red-500'>
                            {code}
                        </h3>

                        <p>
                            If you didn’t request funds withdrawal,{' '}
                            <Link
                                className='text-blue-500 hover:underline'
                                href={
                                    'https://deriv.com/en/?is_livechat_open=true'
                                }
                            >
                                contact us
                            </Link>{' '}
                            via live chat.{' '}
                        </p>
                    </div>
                </div>
            </div>
        )

    if (!isReady) {
        return <Loader />
    }

    return (
        <div className='flex h-screen w-screen items-center justify-center px-2'>
            <div className='w-full rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-lg md:w-[60%]'>
                <h1 className='mb-4 py-4 text-center text-4xl font-semibold text-goldAli'>
                    Verify your withdrawal request
                </h1>

                <div className='mb-8 text-center'>
                    <button
                        onClick={() => {
                            sendMessage({
                                paymentagent_withdraw: 1,
                                amount: withdrawData.amountInUSD,
                                currency: 'USD',
                                paymentagent_loginid:
                                    withdrawData.paymentagent_loginid,
                                verification_code: code,
                                // description:'',//optional
                                // dry_run:1,//optional   is for testing
                            })

                            setTimeout(() => {
                                window.location.href = `/cashier?token=${withdrawData.token}`
                            }, 3000)
                        }}
                        className='rounded-lg bg-goldAli px-3 py-2 font-bold text-gray-200 hover:bg-amber-800'
                    >
                        Confirm Withdrawal
                    </button>
                </div>
            </div>
        </div>
    )
}
