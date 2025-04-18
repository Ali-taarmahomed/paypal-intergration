'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const NavBar = ({
    params,
}: {
    params: Record<string, string | number | boolean>
}) => {
    const { token } = params

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [hasOpenedBefore, setHasOpenedBefore] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        if (isMenuOpen && sidebarRef.current && !hasOpenedBefore) {
            const sidebar = sidebarRef.current

            const scrollToBottomAndBack = async () => {
                sidebar.scrollTo({
                    top: sidebar.scrollHeight,
                    behavior: 'smooth',
                })

                await new Promise(resolve => setTimeout(resolve, 700))

                sidebar.scrollTo({ top: 0, behavior: 'smooth' })
            }

            scrollToBottomAndBack()
            setHasOpenedBefore(true)
        }
    }, [isMenuOpen, hasOpenedBefore])

    const slashPath = window.location.pathname
    const lastPath = slashPath.split('/')
    const currentPath = lastPath[lastPath.length - 1]

    return (
        <>
            <div className='fixed left-0 right-0 top-0 z-50 border-b border-goldAli bg-[#1A1B25] p-4'>
                <div className='flex items-center justify-between'>
                    <div className='text-center'>
                        <h1 className='text-4xl font-bold text-goldAli'>
                            DollarTradeClub
                        </h1>
                        <p className='text-m px-1 py-1 text-red-500'>
                            Powered by Deriv
                        </p>
                    </div>

                    <button
                        onClick={handleToggleMenu}
                        className='flex h-10 w-10 items-center justify-center rounded bg-[#FF9F1C] text-white transition-transform duration-300 focus:outline-none'
                    >
                        <div className='relative flex items-center justify-center'>
                            <div
                                className={`absolute h-1 w-6 rounded bg-white transition-all duration-300 ${
                                    isMenuOpen
                                        ? 'translate-y-0 rotate-45'
                                        : '-translate-y-2'
                                }`}
                            ></div>
                            <div
                                className={`absolute h-1 w-6 rounded bg-white transition-opacity duration-300 ${
                                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            ></div>
                            <div
                                className={`absolute h-1 w-6 rounded bg-white transition-all duration-300 ${
                                    isMenuOpen
                                        ? 'translate-y-0 -rotate-45'
                                        : 'translate-y-2'
                                }`}
                            ></div>
                        </div>
                    </button>
                </div>
            </div>

            <div
                ref={sidebarRef}
                className={`fixed right-0 top-0 h-full w-64 transform overflow-y-auto bg-[#141A26] shadow-lg transition-transform duration-300 ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ zIndex: 10 }}
            >
                <div className='mt-32 flex flex-col gap-4 p-6'>
                    {currentPath === 'devs' && (
                        <>
                            <Link
                                href={`/bots-test?token=${token}`}
                                className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                            >
                                <Image
                                    src='/AIbotsIcon.svg'
                                    alt='AI Bots Test Icon'
                                    width={30}
                                    height={30}
                                    className='mr-3'
                                />
                                <span className='flex-grow text-right text-lg font-semibold'>
                                    AI Bots Test
                                </span>
                            </Link>

                            <Link
                                href={`/accumulators-test?token=${token}`}
                                className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                            >
                                <Image
                                    src='/accumulatorsicon.svg'
                                    alt='Accumulators Test Icon'
                                    width={30}
                                    height={30}
                                    className='mr-3'
                                />
                                <span className='flex-grow text-right text-lg font-semibold'>
                                    Accumulators Test
                                </span>
                            </Link>

                            <Link
                                href={`/aviator-test?token=${token}`}
                                className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                            >
                                <Image
                                    src='/Planeicon.svg'
                                    alt='Aviator Test Icon'
                                    width={30}
                                    height={30}
                                    className='mr-3'
                                />
                                <span className='flex-grow text-right text-lg font-semibold'>
                                    Aviator Test
                                </span>
                            </Link>
                        </>
                    )}

                    <Link
                        href={`/bots?token=${token}`}
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/AIbotsIcon.svg'
                            alt='AI Bots Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            AI Bots
                        </span>
                    </Link>

                    <Link
                        href={`/accumulators?token=${token}`}
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/accumulatorsicon.svg'
                            alt='Accumulators Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            Accumulators
                        </span>
                    </Link>

                    <Link
                        href={`/aviator?token=${token}`}
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/Planeicon.svg'
                            alt='Aviator Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            Aviator
                        </span>
                    </Link>
                    <Link
                        href={`/ComingSoon?token=${token}`}
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-3 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/ComingSoonIcon.svg'
                            alt='Aviator Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            Manual Trading
                        </span>
                    </Link>

                    <Link
                        href={`/devs?token=${token}`}
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/Devicon.svg'
                            alt='Dev Tools Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            Dev Tools
                        </span>
                    </Link>

                    <hr className='my-4 border-t border-gray-600' />

                    <Link
                        href={`/links?token=${token}`}
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/Socialsicon.svg'
                            alt='Our Socials Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            Our Socials
                        </span>
                    </Link>

                    <Link
                        href='https://wa.link/9kv9g5'
                        className='flex items-center rounded-lg border-2 border-[#FF9F1C] bg-[#141A26] px-4 py-3 text-white shadow-lg transition-colors duration-300 hover:bg-[#f39c12]'
                    >
                        <Image
                            src='/Supporticon.svg'
                            alt='Our Socials Icon'
                            width={30}
                            height={30}
                            className='mr-3'
                        />
                        <span className='flex-grow text-right text-lg font-semibold'>
                            Contact Us
                        </span>
                    </Link>

                    <hr className='my-4 border-t border-gray-600' />

                    <Link href={'www.dollartradeclub.co.za'}>
                        <button
                            className='flex w-full items-center justify-center rounded-lg border border-[#e74c3c] bg-[#e74c3c] py-3 font-bold text-white transition-opacity duration-300 hover:opacity-80'
                            style={{ fontSize: '1rem' }}
                        >
                            Logout
                        </button>
                    </Link>

                    <div className='h-36'></div>
                </div>
            </div>

            <div className='h-[6rem]'>&nbsp;</div>
        </>
    )
}

export default NavBar
