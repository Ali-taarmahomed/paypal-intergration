import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GlobalProvider } from '@/state/GlobalProvider'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    manifest: '/manifest.json',
    title: {
        template: 'DollarTradeClub AI | %s ',
        default: 'DollarTradeClub AI | Automated Ai Bots',
    },
    description: 'Welcome to DollarTradeClub AI. Automated AI BOTS',
    keywords: ['DollarTradeClub AI'],
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#172554',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`${inter.className} bg-blueAli`}>
                <GlobalProvider>{children}</GlobalProvider>

                {/* respond.io Script */}
                <script
                    async
                    id='respondio__widget'
                    src='https://cdn.respond.io/webchat/widget/widget.js?cId=b76a1fb62c2233bf561990c8d5f8b50'
                ></script>
            </body>
        </html>
    )
}
