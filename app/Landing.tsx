'use client'

import { HeroSection } from '@/components/hero-section'
import { LogoTicker } from '@/components/LogoTicker'
import { Features } from '@/components/Features'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Head from 'next/head'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { DerivVerifyEmail } from './deriv-verify-email/DerivVerifyEmail'
import { Suspense } from 'react'
import Loader from '@/components/Loader'

export const Landing = () => {
    const { action, code, loginid } = useGetQueryParams() //action should be payment_withdraw

    if (
        action === undefined ||
        action === null ||
        code === undefined ||
        code === null ||
        loginid === undefined ||
        loginid === null
    )
        return (
            <>
                {/* SEO Meta Tags */}
                <Head>
                    <title>
                        DollarTradeClub | Africa&apos;s #1 Free Automated
                        Trading Solutions
                    </title>
                    <meta
                        name='description'
                        content="DollarTradeClub offers Africa's #1 free automated trading solutions. Enjoy cutting-edge tools and strategies at no cost. Transform your trading today!"
                    />
                    <meta
                        name='keywords'
                        content='DollarTradeClub, free automated trading, free trading tools, free trading solutions, trading bots, Africa trading platform'
                    />
                    <meta name='author' content='DollarTradeClub' />
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1.0'
                    />
                    <meta
                        property='og:title'
                        content="DollarTradeClub | Africa's #1 Free Automated Trading Solutions"
                    />
                    <meta
                        property='og:description'
                        content="Discover DollarTradeClub, Africa's leading platform for free automated trading solutions. Access powerful tools and strategies, all for free!"
                    />
                    <meta property='og:image' content='favicon.ico' />
                    <meta
                        property='og:url'
                        content='https://dollartradeclub.com'
                    />
                    <meta property='og:type' content='website' />
                    <link rel='canonical' href='https://dollartradeclub.com' />
                    <link rel='icon' href='/favicon.ico' type='image/x-icon' />
                </Head>

                {/* Navbar */}
                <SiteHeader />

                {/* Main Content */}
                <main>
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Logo Ticker Section */}
                    <LogoTicker />

                    {/* Features Section */}
                    <Features />
                </main>

                {/* Footer */}
                <SiteFooter />
            </>
        )

    return (
        <Suspense fallback={<Loader />}>
            <DerivVerifyEmail />
        </Suspense>
    )
}
