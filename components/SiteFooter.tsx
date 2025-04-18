'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function SiteFooter() {
    return (
        <footer className='border-t-2 bg-[rgba(10,17,40,0.9)] py-8 text-goldAli'>
            <div className='container mx-auto flex flex-col gap-6'>
                {/* Logo */}
                <div className='flex items-center justify-center'>
                    <div className='inline-flex items-center justify-center rounded-lg'>
                        <Image
                            src='/DTC banner.svg'
                            alt='DollarTradeClub Banner'
                            width={200}
                            height={100}
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className='flex flex-wrap justify-center gap-4'>
                    <Link
                        href='https://wa.link/yncoif'
                        className='rounded-full border border-goldAli bg-transparent px-4 py-2 font-medium text-goldAli transition hover:bg-goldAli hover:text-black'
                        target='_blank'
                    >
                        WhatsApp Us
                    </Link>
                    <Link
                        href='https://chat.whatsapp.com/C53x8i3jCttJxz08G6yrlp'
                        className='rounded-full border border-goldAli bg-transparent px-4 py-2 font-medium text-goldAli transition hover:bg-goldAli hover:text-black'
                        target='_blank'
                    >
                        Join WhatsApp Community
                    </Link>
                    <Link
                        href='https://whatsapp.com/channel/0029Vav3cKj4yltNZHSV0F0c'
                        className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                        target='_blank'
                    >
                        Follow Our WhatsApp Channel
                    </Link>
                    <Link
                        href='https://t.me/+2_T06ZBoycg3MTJk'
                        className='rounded-full border border-goldAli bg-transparent px-4 py-2 font-medium text-goldAli transition hover:bg-goldAli hover:text-black'
                        target='_blank'
                    >
                        Telegram Group
                    </Link>
                    <Link
                        href='https://www.youtube.com/@DollarTradeClub'
                        className='rounded-full border border-goldAli bg-transparent px-4 py-2 font-medium text-goldAli transition hover:bg-goldAli hover:text-black'
                        target='_blank'
                    >
                        YouTube Tutorials
                    </Link>
                </div>

                {/* Copyright and Credits */}
                <div className='text-center'>
                    <p className='text-sm text-goldAli'>
                        ©️ 2024 DollarTradeClub. All rights reserved. Built by
                        <Link
                            href='https://wa.me/27601234786'
                            target='_blank'
                            rel='noreferrer'
                            className='ml-1 font-medium underline underline-offset-4'
                        >
                            DTCwebworks
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </footer>
    )
}
