'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { MenuIcon, X } from 'lucide-react'

export default function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <header className='fixed top-0 z-50 w-full border-b border-white/10 bg-[rgba(10,17,40,0.9)] py-4'>
                <div className='container mx-auto flex items-center justify-between px-4 md:px-8'>
                    {/* Logo */}
                    <Link href={'/'}>
                        <div className='flex items-center'>
                            <Image
                                src='/logo.svg' // Ensur eyour logo is in the correct `public` directory
                                alt='Site Logo'
                                width={40}
                                height={40}
                                className='h-auto'
                            />
                            <span className='ml-2 text-xl font-bold text-goldAli'>
                                DollarTradeClub
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden gap-6 text-sm md:flex'>
                        <Link
                            href='https://wa.link/yncoif'
                            className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                            target='_blank'
                        >
                            WhatsApp Us
                        </Link>
                        <Link
                            href='https://chat.whatsapp.com/C53x8i3jCttJxz08G6yrlp'
                            className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
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
                            className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                            target='_blank'
                        >
                            Telegram Group
                        </Link>
                        <Link
                            href='https://www.youtube.com/@DollarTradeClub'
                            className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                            target='_blank'
                        >
                            YouTube Tutorials
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <div className='md:hidden'>
                        {!isOpen ? (
                            <MenuIcon
                                className='h-8 w-8 cursor-pointer text-goldAli hover:text-gray-300'
                                onClick={() => setIsOpen(true)}
                            />
                        ) : (
                            <X
                                className='h-8 w-8 cursor-pointer text-goldAli hover:text-gray-300'
                                onClick={() => setIsOpen(false)}
                            />
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isOpen && (
                    <div className='absolute left-0 top-full z-40 w-full border-t border-white/10 bg-[rgba(10,17,40,0.95)] shadow-lg'>
                        <nav className='flex flex-col gap-4 p-4 text-sm'>
                            <Link
                                href='https://wa.me/YOUR_WHATSAPP_NUMBER'
                                className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                                target='_blank'
                                onClick={() => setIsOpen(false)}
                            >
                                WhatsApp Us
                            </Link>
                            <Link
                                href='https://chat.whatsapp.com/YOUR_COMMUNITY_LINK'
                                className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                                target='_blank'
                                onClick={() => setIsOpen(false)}
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
                                href='https://t.me/YOUR_TELEGRAM_GROUP'
                                className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                                target='_blank'
                                onClick={() => setIsOpen(false)}
                            >
                                Telegram Group
                            </Link>
                            <Link
                                href='https://www.youtube.com/YOUR_YOUTUBE_CHANNEL'
                                className='rounded-full border border-goldAli bg-transparent px-4 py-2 text-goldAli transition hover:bg-goldAli hover:text-black'
                                target='_blank'
                                onClick={() => setIsOpen(false)}
                            >
                                YouTube Tutorials
                            </Link>
                        </nav>
                    </div>
                )}
            </header>
        </>
    )
}
