'use client'

import React from 'react'
import Link from 'next/link'
import { MdOutlineAttachMoney, MdFlight } from 'react-icons/md'
import { LiaRobotSolid } from 'react-icons/lia'
import { SlGraph } from 'react-icons/sl'
import { GrManual } from 'react-icons/gr'

export const BottomNav = ({ token }: { token: string }) => {
    return (
        <div>
            {/* This adds extra space above the BottomNav */}
            <div className='h-32'></div>

            <div className='bottom-nav fixed bottom-0 left-0 z-50 flex w-full items-center justify-evenly bg-[#1A1B25] px-4 shadow-lg'>
                <div className='nav-item'>
                    <Link
                        href={`/bots?token=${token}`}
                        className='flex flex-col items-center text-white transition-colors duration-300 hover:text-yellow-400'
                    >
                        <span className='nav-icon'>
                            <LiaRobotSolid className='text-yellow-500' />
                        </span>
                        <span className='nav-text'>AI Bots</span>
                    </Link>
                </div>

                <div className='nav-item'>
                    <Link
                        href={`/accumulators?token=${token}`}
                        className='flex flex-col items-center text-white transition-colors duration-300 hover:text-yellow-400'
                    >
                        <span className='nav-icon'>
                            <SlGraph className='text-yellow-500' />
                        </span>
                        <span className='nav-text'>Accumulators</span>
                    </Link>
                </div>

                <div className='nav-item'>
                    <Link
                        href={`/aviator?token=${token}`}
                        className='flex flex-col items-center text-white transition-colors duration-300 hover:text-yellow-400'
                    >
                        <span className='nav-icon'>
                            <MdFlight className='text-yellow-500' />
                        </span>
                        <span className='nav-text'>Aviator</span>
                    </Link>
                </div>

                <div className='nav-item'>
                    <Link
                        href={`/manual?token=${token}`}
                        className='flex flex-col items-center text-white transition-colors duration-300 hover:text-yellow-400'
                    >
                        <span className='nav-icon'>
                            <GrManual className='text-yellow-500' />
                        </span>
                        <span className='nav-text'>Manual Trading</span>
                    </Link>
                </div>

                <div className='nav-item'>
                    <Link
                        href={`/cashier?token=${token}`}
                        className='flex flex-col items-center text-white transition-colors duration-300 hover:text-yellow-400'
                    >
                        <span className='nav-icon'>
                            <MdOutlineAttachMoney className='text-yellow-500' />
                        </span>
                        <span className='nav-text'>Cashier</span>
                    </Link>
                </div>

                <style jsx>{`
                    .bottom-nav {
                        padding: 12px 0;
                        padding-bottom: 30px;
                    }
                    .nav-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .nav-icon {
                        width: 44px;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .nav-icon :global(svg) {
                        width: 100%;
                        height: 100%;
                    }
                    .nav-text {
                        font-size: 14px;
                        margin-top: 4px;
                        transition: font-size 0.2s ease;
                    }

                    @media (max-width: 768px) {
                        .bottom-nav {
                            padding-bottom: 35px;
                        }
                        .nav-icon {
                            width: 28px;
                            height: 28px;
                        }
                        .nav-text {
                            font-size: 10px;
                            margin-top: 2px;
                        }
                    }

                    @media (max-width: 480px) {
                        .bottom-nav {
                            padding-bottom: 40px;
                        }
                        .nav-icon {
                            width: 24px;
                            height: 24px;
                        }
                        .nav-text {
                            font-size: 10px;
                            margin-top: 2px;
                        }
                    }
                `}</style>
            </div>
        </div>
    )
}

export default BottomNav
