'use client'

import { useEffect, useState } from 'react'

export function DTCRedirect() {
    const [countdown, setCountdown] = useState(15) // Start from 8 seconds

    useEffect(() => {
        if (countdown === 0) {
            window.location.href = 'https://dollartradeclub.co.za'
        }

        const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1)
        }, 1000) // Decrease by 1 every second

        return () => clearInterval(timer) // Clear interval on component unmount
    }, [countdown])

    return (
        <div className='flex h-screen items-center justify-center bg-gradient-to-br from-[#0A1128] via-[#1E2A47] to-[#344a63] px-4 text-center text-white'>
            <div className='max-w-md space-y-6'>
                <h1 className='text-2xl font-bold md:text-4xl'>
                    Welcome to DollarTradeClub!
                </h1>
                <p className='text-lg md:text-xl'>
                    The domain{' '}
                    <span className='font-semibold text-goldAli'>
                        ai.dollartradeclub.co.za
                    </span>{' '}
                    has been updated to{' '}
                    <span className='font-semibold text-goldAli'>
                        dollartradeclub.co.za
                    </span>
                    .
                </p>
                <p className='text-white/70'>
                    The &apos;ai&apos; subdomain is no longer required. Please
                    save the new website url without &apos;ai&apos;. Redirecting
                    in{' '}
                    <span className='font-bold text-goldAli'>
                        {countdown > 0 ? countdown : 'Redirecting...'}
                    </span>{' '}
                    seconds.
                </p>
                <button
                    onClick={() =>
                        (window.location.href = 'https://dollartradeclub.co.za')
                    }
                    className='mt-4 rounded-full bg-goldAli px-6 py-2 font-bold text-black shadow-md transition hover:bg-yellow-600'
                >
                    Not automatically redirected? Click here
                </button>
            </div>
        </div>
    )
}
