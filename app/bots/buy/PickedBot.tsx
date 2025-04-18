// PickedBot.tsx

'use client'
import React, { useEffect, useState } from 'react'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { buyBot } from '../actions'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { convertCurrency } from '@/lib/currency-converter'

export const PickedBot: React.FC = () => {
    const { email, loginId, botName, amountInUSD } = useGetQueryParams()
    const [exchangeRate, setExchangeRate] = useState<number>(0)

    useEffect(() => {
        const fn = async () => {
            try {
                const rate = await convertCurrency(1, 'USD', 'ZAR')
                setExchangeRate(rate)
            } catch (error) {
                console.error('Failed to get exchange rate:', error)
            }
        }
        fn()
    }, [])

    const [confirmationCode, setConfirmationCode] = useState<string>('')
    const [freeEmail, setFreeEmail] = useState<string>('') // New state for free email submission

    return (
        <>
            {/* Updated Header */}
            <div className='flex items-center justify-between border-b border-goldAli bg-DarkerBlue p-4 pb-4'>
                <div className='text-center'>
                    <h1 className='text-4xl font-bold text-goldAli'>
                        DollarTradeClub
                    </h1>
                    <p className='text-m px-1 py-1 text-red-500'>
                        Powered by Deriv
                    </p>
                </div>
            </div>

            {/* Buttons Section: Moved below the account section */}
            <div className='flex w-full items-center justify-center gap-4 py-4'>
                <button
                    onClick={() =>
                        window.open(
                            'https://wa.me/27678606786?text=Hi,%20I%20need%20help%20choosing%20an%20option%20on%20DollarTradeClub%20AI.',
                            '_blank'
                        )
                    }
                    className='rounded bg-green-600 px-4 py-2 text-lg font-bold text-white hover:bg-green-700'
                >
                    Need Help? WhatsApp Us!
                </button>
                <button
                    onClick={() =>
                        window.open('https://www.youtube.com/', '_blank')
                    } // Add your YouTube link here
                    className='rounded bg-red-600 px-4 py-2 text-lg font-bold text-white hover:bg-red-700'
                >
                    Watch Tutorial on YouTube
                </button>
            </div>

            {/* Free Bot Section */}
            <div
                id='free-bot-instructions'
                className='mx-auto flex w-full flex-col items-center justify-center gap-4 rounded-lg border-4 border-goldAli bg-gray-800 px-6 py-8 text-gray-300 md:w-2/3'
            >
                <h3 className='mb-2 text-lg font-bold text-white'>
                    Get the Bot for Free - Instructions
                </h3>
                <ol className='list-inside list-decimal text-sm text-white'>
                    <li>
                        <strong>Step 1:</strong> Open a new Deriv account using
                        our referral link:
                        <a
                            href='https://deriv.com/signup/?ref=YOUR_REFERRAL_CODE'
                            target='_blank'
                            className='text-blue-500 underline hover:text-blue-300'
                        >
                            {' '}
                            Click here to sign up.
                        </a>
                    </li>
                    <li>
                        <strong>Step 2:</strong> After creating your new
                        account, note down the email address you used to
                        register.
                    </li>
                    <li>
                        <strong>Step 3:</strong> Enter your newly opened
                        account&apos;s email in the field below.
                    </li>
                    <li>
                        <strong>Step 4:</strong> Alternatively, WhatsApp us at
                        +27 6786 06786 with your new account email and proof of
                        sign-up through our referral link.
                    </li>
                    <li>
                        <strong>Step 5:</strong> Once verified, we will approve
                        your access to the bot.
                    </li>
                </ol>
                <p className='mt-3 text-sm text-white'>
                    Please note: Approval may take up to 24 hours. Use the
                    referral link above for sign-up.
                </p>

                {/* Free Bot Email Submission */}
                <div className='flex w-full flex-col items-center gap-1'>
                    <label className='pl-2 text-center' htmlFor='freeEmail'>
                        Enter New Deriv Account Email:
                    </label>
                    <input
                        className='w-2/3 rounded-lg border border-goldAli px-4 py-2 text-blueAli md:w-1/2 md:py-3'
                        type='text'
                        onChange={e => setFreeEmail(e.currentTarget.value)}
                        name='freeEmail'
                        id='freeEmail'
                        placeholder='Enter your new Deriv account email:'
                    />
                    <button
                        onClick={async () => {
                            try {
                                const { isAdded, reason } = await buyBot({
                                    email: freeEmail,
                                    loginId,
                                    botName,
                                    amountInUSD,
                                    confirmationCode,
                                })

                                if (isAdded) {
                                    toast.success(reason)
                                } else {
                                    toast.error(reason)
                                }
                            } catch (error) {
                                console.error(
                                    'Error while submitting order:',
                                    error
                                )
                                toast.error(
                                    'There was an error processing your request.'
                                )
                            }
                        }}
                        className='mt-4 w-2/3 rounded-lg bg-blue-600 px-4 py-3 text-center font-bold uppercase text-white transition hover:bg-goldAli md:w-1/2'
                    >
                        Submit Free Access Request
                    </button>
                </div>
            </div>

            {/* Separator for OR */}
            <div className='my-6 flex w-full items-center justify-center'>
                <span className='text-lg font-bold text-gray-500'>OR</span>
            </div>

            {/* Paid Bot Section */}
            <div
                id='paid-bot-instructions'
                className='mx-auto flex w-full flex-col items-center justify-center gap-4 rounded-lg border-4 border-goldAli bg-gray-800 px-6 py-8 text-gray-300 md:w-2/3'
            >
                <h3 className='mb-2 text-lg font-bold text-white'>
                    Don&apos;t want to create a new account? Subscribe for
                    R499/month!
                </h3>
                <ol className='list-inside list-decimal text-sm text-white'>
                    <li>
                        <strong>Step 1:</strong> Click the &quot;Purchase
                        Now&quot; button below and complete the payment process.
                    </li>
                    <li>
                        <strong>Step 2:</strong> After payment, note down the
                        order number you received from PayFast.
                    </li>
                    <li>
                        <strong>Step 3:</strong> Return to this page and enter
                        your order number in the field below.
                    </li>
                    <li>
                        <strong>Step 4:</strong> Alternatively, WhatsApp us at
                        +27 6786 06786 with your order number and existing Deriv
                        email.
                    </li>
                    <li>
                        <strong>Step 5:</strong> Once verified, we will approve
                        your access to the bot.
                    </li>
                </ol>

                <Link href={`https://purchase.dollartradeclub.co.za/`}>
                    <button className='mt-4 rounded-lg bg-goldAli px-4 py-3 text-center font-bold uppercase text-white transition hover:bg-blue-600'>
                        Purchase Now:{' '}
                        {`R${(
                            Math.floor(amountInUSD * exchangeRate * 100) / 100
                        ).toFixed(2)}/pm`}
                    </button>
                </Link>

                {/* Paid Bot Order Submission */}
                <div className='mt-4 flex w-full flex-col items-center gap-1'>
                    <label className='pl-2 text-center' htmlFor='orderNumber'>
                        Enter Paid Order Number:
                    </label>
                    <input
                        className='w-2/3 rounded-lg border border-goldAli px-4 py-2 text-blueAli md:w-1/2 md:py-3'
                        type='text'
                        onChange={e =>
                            setConfirmationCode(e.currentTarget.value)
                        }
                        name='orderNumber'
                        id='orderNumber'
                        placeholder='Enter your paid order number:'
                    />
                    <button
                        onClick={async () => {
                            try {
                                const { isAdded, reason } = await buyBot({
                                    email,
                                    loginId,
                                    botName,
                                    amountInUSD,
                                    confirmationCode,
                                })

                                if (isAdded) {
                                    toast.success(reason)
                                } else {
                                    toast.error(reason)
                                }
                            } catch (error) {
                                console.error(
                                    'Error while submitting order:',
                                    error
                                )
                                toast.error(
                                    'There was an error processing your request.'
                                )
                            }
                        }}
                        className='mt-4 w-2/3 rounded-lg bg-blue-600 px-4 py-3 text-center font-bold uppercase text-white transition hover:bg-goldAli md:w-1/2'
                    >
                        Submit Paid Order Number
                    </button>
                </div>
            </div>
        </>
    )
}
