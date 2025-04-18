'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const QuickNavigationButtons = ({ token }: { token: string }) => {
    return (
        <div className='flex items-center justify-center gap-4 border-b border-goldAli bg-[#1A1B25] px-4 py-4'>
            {/* AI Bots Button */}
            <Link
                href={`/bots?token=${token}`}
                className='flex items-center rounded-full border border-[#FF9F1C] bg-[#141A26] px-3 py-2 text-white shadow-md transition-colors duration-300 hover:bg-[#f39c12] md:px-4 md:py-3'
            >
                <Image
                    src='/AIbotsIcon.svg'
                    alt='AI Bots Icon'
                    width={20}
                    height={20}
                    className='mr-2 md:mr-3'
                />
                <span className='text-center text-sm font-medium md:text-base'>
                    AI Bots
                </span>
            </Link>

            {/* Accumulators Button */}
            <Link
                href={`/accumulators?token=${token}`}
                className='flex items-center rounded-full border border-[#FF9F1C] bg-[#141A26] px-3 py-2 text-white shadow-md transition-colors duration-300 hover:bg-[#f39c12] md:px-4 md:py-3'
            >
                <Image
                    src='/accumulatorsicon.svg'
                    alt='Accumulators Icon'
                    width={20}
                    height={20}
                    className='mr-2 md:mr-3'
                />
                <span className='text-center text-sm font-medium md:text-base'>
                    Accumulators
                </span>
            </Link>

            {/* Aviator Button */}
            <Link
                href={`/aviator?token=${token}`}
                className='flex items-center rounded-full border border-[#FF9F1C] bg-[#141A26] px-3 py-2 text-white shadow-md transition-colors duration-300 hover:bg-[#f39c12] md:px-4 md:py-3'
            >
                <Image
                    src='/Planeicon.svg'
                    alt='Aviator Icon'
                    width={20}
                    height={20}
                    className='mr-2 md:mr-3'
                />
                <span className='text-center text-sm font-medium md:text-base'>
                    Aviator
                </span>
            </Link>
        </div>
    )
}

export default QuickNavigationButtons
