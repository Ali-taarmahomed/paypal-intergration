// tiktok.tsx
'use client'

import React from 'react'

const TikTokPage = () => {
    return (
        <div className='flex min-h-screen flex-col items-center bg-[#1A1B25] p-6 text-gray-300'>
            {/* Header Section */}
            <header className='mt-8 px-4 text-center'>
                <img
                    src='/icon512_rounded.png'
                    alt='DTC Enterprise Logo'
                    className='mx-auto mb-4 h-24 w-24 rounded-full border-4 border-goldAli'
                />
                <h1 className='mb-4 text-4xl font-bold text-goldAli'>
                    Please read below to access the FREE DERIV BOTS.{' '}
                </h1>

                <p className='text-lg leading-relaxed text-gray-300'>
                    TikTok doesn’t allow links to open outside of Tiktok. To
                    continue and have a better experience, please hold down the
                    button below, click on copy link, and paste it into your
                    browser for an easier experience.
                </p>
            </header>

            {/* Main Buttons Section */}
            <main className='mt-10 flex w-full max-w-md flex-col items-center gap-6'>
                {/* Linktr.ee Section */}
                <div className='w-full rounded-2xl border-4 border-goldAli p-6 text-center'>
                    <a
                        href='https://linktr.ee/dtcenterprise'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block w-full rounded-xl bg-goldAli px-4 py-3 text-center font-bold text-black shadow-lg transition hover:bg-opacity-90'
                    >
                        Hold Down & Copy Link
                    </a>
                    <p className='mb-2 mt-2'>
                        Buttons not working? Copy and paste this link:
                    </p>
                    <a
                        href='https://linktr.ee/dtcenterprise'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-bold text-goldAli'
                    >
                        linktr.ee/dtcenterprise
                    </a>
                </div>

                {/* AI Bots Section */}
                <div className='w-full rounded-2xl border-4 border-goldAli p-6 text-center'>
                    <p className='mb-4 text-4xl font-bold text-goldAli'>
                        Already know how to use DTC FREE AI Deriv bots?
                    </p>
                    <a
                        href='https://dollartradeclub.co.za'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block w-full rounded-xl bg-goldAli px-4 py-3 text-center font-bold text-black shadow-lg transition hover:bg-opacity-90'
                    >
                        Access Free AI Bots
                    </a>
                    <p className='mb-2 mt-2'>Button not working? Click Here:</p>
                    <a
                        href='https://dollartradeclub.co.za'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-bold text-goldAli'
                    >
                        dollartradeclub.co.za
                    </a>
                </div>

                {/* Tutorial Section */}
                <div className='w-full rounded-2xl border-4 border-goldAli p-6 text-center'>
                    <p className='mb-4 text-4xl font-bold text-goldAli'>
                        Need a video tutorial on the free AI bots?
                    </p>
                    <a
                        href='https://www.youtube.com/channel/UCFD8FlGsOLXcQaHwibY7VUg'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block w-full rounded-xl bg-goldAli px-4 py-3 text-center font-bold text-black shadow-lg transition hover:bg-opacity-90'
                    >
                        Watch Tutorial Here
                    </a>
                </div>

                {/* WhatsApp Info Section */}
                <div className='w-full rounded-2xl border-4 border-goldAli p-6 text-center'>
                    <p className='text-lg'>
                        Have questions? WhatsApp us at{' '}
                        <a
                            href='https://wa.me/0601234786'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-bold text-goldAli'
                        >
                            06 01234 786
                        </a>
                    </p>
                </div>
            </main>

            {/* Styling */}
            <style jsx>{`
                .bg-goldAli {
                    background-color: #ff9f1c;
                }
                .text-goldAli {
                    color: #ff9f1c;
                }
                @media (min-width: 768px) {
                    header {
                        margin-top: 4rem;
                    }
                    main {
                        margin-top: 2rem;
                    }
                }
            `}</style>
        </div>
    )
}

export default TikTokPage
