'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head' // Import Head for SEO

export function HeroSection() {
    const AppId = process.env.NEXT_PUBLIC_DERIV_APP_ID as string
    const AppUrl = process.env.NEXT_PUBLIC_DERIV_HTTP_URL as string
    const DerivAffUrl = process.env.NEXT_PUBLIC_DERIV_AFFILIATE_URL as string

    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: [`start end`, 'end start'],
    })
    const backgroundPositionY = useTransform(
        scrollYProgress,
        [0, 1],
        [-300, 300]
    )

    return (
        <>
            {/* SEO Meta Tags for Structured Data */}
            <Head>
                <script type='application/ld+json'>
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'DollarTradeClub',
                        url: 'https://dollartradeclub.com',
                        potentialAction: [
                            {
                                '@type': 'SearchAction',
                                name: 'Login',
                                target: `${AppUrl}${AppId}`,
                                description:
                                    "Login to start trading with DollarTradeClub's free automated trading solutions.",
                            },
                            {
                                '@type': 'SearchAction',
                                name: 'Create Account',
                                target: DerivAffUrl,
                                description:
                                    "Create an account to access DollarTradeClub's free automated trading solutions and strategies.",
                            },
                        ],
                    })}
                </script>
            </Head>

            <motion.section
                animate={{ backgroundPositionX: '100%' }}
                transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                className='relative flex h-auto items-center justify-center overflow-hidden bg-cover bg-center pb-8 pt-24 md:pb-16 md:pt-32'
                style={{
                    backgroundImage: `radial-gradient(circle, #0A1128 20%, #1E2A47 60%, #3C4F6A 100%)`, // Navy blue gradient
                    backgroundPositionY,
                }}
                ref={sectionRef}
            >
                {/* Hero Section Content */}
                <div className='container relative text-center'>
                    <h1
                        className='bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-8xl md:leading-none lg:text-[100px]'
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, white, rgba(255,255,255,0.8))',
                        }}
                    >
                        AFRICA&apos;S #1
                    </h1>
                    <h1 className='-rotate-3 transform text-6xl font-bold italic tracking-tighter text-goldAli sm:text-7xl md:text-9xl md:leading-none lg:text-[120px]'>
                        FREE
                    </h1>
                    <h1
                        className='bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-8xl md:leading-none lg:text-[100px]'
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, white, rgba(255,255,255,0.8))',
                        }}
                    >
                        AUTOMATED TRADING SOLUTIONS
                    </h1>

                    {/* Buttons */}
                    <div className='mt-10 flex flex-col justify-center gap-4'>
                        <Link href={`${AppUrl}${AppId}`}>
                            <button className='rounded-lg bg-red-500 px-4 py-2 text-sm font-bold uppercase text-white shadow-md hover:bg-red-700 sm:text-base md:py-3'>
                                Login with Deriv
                            </button>
                        </Link>

                        <Link href={DerivAffUrl}>
                            <button className='rounded-lg bg-goldAli px-4 py-2 text-sm font-bold uppercase text-white shadow-md hover:bg-yellow-600 sm:text-base md:py-3'>
                                Create Deriv Account
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.section>
        </>
    )
}
