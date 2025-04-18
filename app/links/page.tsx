'use client'

import Image from 'next/image'
import Link from 'next/link'

const LinksPage = () => {
    return (
        <div className='flex min-h-screen flex-col items-center bg-[#1A1B25] p-6 text-center'>
            <Image
                src='/logo.svg'
                alt='DTC Logo'
                width={100}
                height={100}
                className='mt-10'
            />
            <h1 className='mt-6 text-3xl font-bold text-[#FF9F1C]'>
                DTC Enterprise PTY LTD
            </h1>

            <p className='mt-4 max-w-md text-lg text-[#FF9F1C]'>
                Join our socials to stay up to date with the latest free bots,
                announcements, and updates, including when our site goes down
                and important news!
            </p>

            <div className='mt-8 flex w-full max-w-md flex-col gap-6'>
                {[
                    {
                        href: 'https://chat.whatsapp.com/C53x8i3jCttJxz08G6yrlp',
                        label: 'WhatsApp Group',
                        icon: '/Whatsapp.svg',
                    },
                    {
                        href: 'https://whatsapp.com/channel/0029Vav3cKj4yltNZHSV0F0c',
                        label: 'Follow WhatsApp Channel',
                        icon: '/Whatsapp.svg',
                    },
                    {
                        href: 'https://wa.me/27601234786',
                        label: 'WhatsApp Us',
                        icon: '/Whatsapp.svg',
                    },
                    {
                        href: 'https://t.me/+RO6d8A32aX8wYzI0',
                        label: 'Telegram Group',
                        icon: '/telegram.svg',
                    },
                    {
                        href: 'https://t.me/DollarTradeClubBot',
                        label: 'Telegram Self-Service Bot',
                        icon: '/telegram.svg',
                    },
                    {
                        href: 'https://www.tiktok.com/@ai.dollartradeclub.co.za?_t=8rC5u51Jyf1&_r=1',
                        label: 'TikTok',
                        icon: '/tiktok.svg',
                    },
                    {
                        href: 'https://www.youtube.com/channel/UCFD8FlGsOLXcQaHwibY7VUg',
                        label: 'YouTube',
                        icon: '/youtube.svg',
                    },
                ].map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex w-full items-center rounded-lg border-2 border-[#FF9F1C] bg-transparent px-4 py-4 font-bold text-[#FF9F1C] transition-all hover:bg-[#FF9F1C] hover:text-[#1A1B25]'
                    >
                        <Image
                            src={link.icon}
                            alt={`${link.label} Icon`}
                            width={24}
                            height={24}
                            className='mr-4'
                        />
                        <span className='flex-grow text-center'>
                            {link.label}
                        </span>
                    </Link>
                ))}
            </div>

            <div className='mt-16 pb-20 text-sm text-gray-500'></div>
        </div>
    )
}

export default LinksPage
