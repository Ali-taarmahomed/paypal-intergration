'use client'
import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import {
    MdOutlineAttachMoney,
    MdFlight,
    MdTrendingUp,
    MdComputer,
    MdDeveloperMode,
} from 'react-icons/md'
import { LiaRobotSolid } from 'react-icons/lia'
import { SlGraph } from 'react-icons/sl'
import { GrManual } from 'react-icons/gr'
import { TbLogout } from 'react-icons/tb'
import { PiLinkSimple } from 'react-icons/pi'
import { BiSupport } from 'react-icons/bi'
import Link from 'next/link'

export const Header = ({ token }: { token: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [hasOpenedBefore, setHasOpenedBefore] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)

    const navItems = [
        { name: 'AI Bots', link: 'bots', icon: <LiaRobotSolid size={22} /> },
        {
            name: 'Accumulators',
            link: 'accumulators',
            icon: <SlGraph size={22} />,
        },
        { name: 'Aviator', link: 'aviator', icon: <MdFlight size={22} /> },
        {
            name: 'Manual Trading',
            link: 'manual',
            icon: <GrManual size={22} />,
        },
        {
            name: 'Dev Tools',
            link: 'devs',
            icon: <MdDeveloperMode size={22} />,
        },
        {
            name: 'Our Socials',
            link: 'links',
            icon: <PiLinkSimple size={22} />,
        },
    ]

    useEffect(() => {
        if (isOpen && sidebarRef.current && !hasOpenedBefore) {
            const sidebar = sidebarRef.current
            const scrollToBottomAndBack = async () => {
                sidebar.scrollTo({
                    top: sidebar.scrollHeight,
                    behavior: 'smooth',
                })
                await new Promise(resolve => setTimeout(resolve, 700))
                sidebar.scrollTo({ top: -200, behavior: 'smooth' }) // scroll up more
            }

            scrollToBottomAndBack()
            setHasOpenedBefore(true)
        }
    }, [isOpen, hasOpenedBefore])

    return (
        <>
            {/* Top Bar */}
            <div className='fixed left-0 right-0 top-0 z-[9999] border-b border-goldAli bg-[#1A1B25] p-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                        <div className='text-2xl font-bold text-goldAli'>
                            DollaTradeClub
                        </div>
                        <div className='-mt-1 self-end text-sm text-red-500'>
                            Powered by Deriv
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className='hidden items-center gap-4 md:flex'>
                        {navItems.map(item => (
                            <Link
                                key={item.name}
                                href={`/${item.link}?token=${token}`}
                                className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-2 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                            >
                                <span className='mr-2 text-yellow-500'>
                                    {item.icon}
                                </span>
                                <span className='font-semibold'>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                        <Link
                            href='/'
                            className='flex items-center rounded-lg border-2 border-[#e74c3c] bg-[#e74c3c] px-4 py-2 text-white shadow-lg transition-opacity duration-300 hover:opacity-80'
                        >
                            <TbLogout size={22} className='mr-2' />
                            <span className='font-semibold'>Logout</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='md:hidden'
                    >
                        <div className='relative flex h-10 w-10 items-center justify-center rounded bg-[#FF9F1C] text-white'>
                            <div
                                className={`absolute h-1 w-6 rounded bg-white transition-all duration-300 ${
                                    isOpen
                                        ? 'translate-y-0 rotate-45'
                                        : '-translate-y-2'
                                }`}
                            />
                            <div
                                className={`absolute h-1 w-6 rounded bg-white transition-opacity duration-300 ${
                                    isOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            <div
                                className={`absolute h-1 w-6 rounded bg-white transition-all duration-300 ${
                                    isOpen
                                        ? 'translate-y-0 -rotate-45'
                                        : 'translate-y-2'
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed right-0 top-0 z-[999] h-full w-64 transform overflow-y-auto bg-[#141A26] shadow-lg transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } md:hidden`}
            >
                <button
                    className='absolute right-4 top-4 text-white'
                    onClick={() => setIsOpen(false)}
                >
                    <X size={24} />
                </button>

                <div className='mt-20 flex flex-col gap-2 p-4 pb-40'>
                    {/* --- Stylized Cashier --- */}

                    <Link
                        href={`/cashier?token=${token}`}
                        className='flex items-center gap-3 rounded-md border-2 border-yellow-400 bg-gradient-to-r from-[#1f1f2e] to-[#2d2d3e] px-3 py-3 text-yellow-300 shadow-md transition-all duration-200 hover:scale-[1.02] hover:border-yellow-500 hover:bg-[#2b2c3d]'
                    >
                        <MdOutlineAttachMoney
                            size={22}
                            className='text-yellow-400'
                        />
                        <span className='text-base font-bold tracking-wide'>
                            Cashier
                        </span>
                    </Link>
                    <hr className='mb-3 border-t border-gray-600' />

                    {/* --- Main Nav Buttons --- */}
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={`/${item.link}?token=${token}`}
                            className='flex items-center gap-3 rounded-md px-3 py-2 text-white transition-all duration-200 hover:bg-[#1f1f2e] hover:pl-4'
                        >
                            <span className='text-yellow-500'>{item.icon}</span>
                            <span className='text-base font-medium'>
                                {item.name}
                            </span>
                        </Link>
                    ))}

                    <hr className='my-3 border-t border-gray-600' />

                    {/* --- Contact --- */}
                    <Link
                        href='https://wa.link/9kv9g5'
                        className='flex items-center gap-3 rounded-md px-3 py-2 text-white transition-all duration-200 hover:bg-[#1f1f2e] hover:pl-4'
                    >
                        <BiSupport size={22} className='text-yellow-500' />
                        <span className='text-base font-medium'>Support</span>
                    </Link>

                    <hr className='my-3 border-t border-gray-600' />

                    {/* --- Red Logout Button --- */}
                    <Link
                        href='/'
                        className='flex items-center justify-center gap-2 rounded-md bg-[#e74c3c] px-3 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:tracking-wide hover:opacity-90 hover:shadow-lg'
                    >
                        <TbLogout size={22} />
                        <span>Logout</span>
                    </Link>
                </div>
            </div>

            {/* Space for fixed header */}
            <div className='h-[6rem]'>&nbsp;</div>
        </>
    )
}
