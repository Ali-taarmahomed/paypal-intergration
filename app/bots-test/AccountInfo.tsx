'use client'
import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/Modal'
import { AccountSelector } from './AccountSelector'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'

export const AccountInfoByBalance = ({
    sendMessage,
}: {
    sendMessage: (message: Record<string, unknown>) => void
}) => {
    const { balance, currency, loginid } = useSelector(
        (state: RootState) => state.derivUser
    )
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showStatusText, setShowStatusText] = useState(true)

    // Determine account type (Demo/Real) - both will show green now
    const accountStatus = loginid.startsWith('VRT') ? 'Demo' : 'Real'
    const accountColor = 'bg-green-500' // Unified green color for both statuses

    // Toggle modal visibility
    const handleModal = () => {
        setIsModalOpen(prevState => !prevState)
    }

    // Handle the pill-to-dot animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowStatusText(false)
        }, 3000) // Show text for 3 seconds before collapsing to dot
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className='flex flex-col items-center justify-center gap-1'>
            {/* Trigger to open modal */}
            <div
                className='flex w-full cursor-pointer items-center rounded-full bg-[#FF9F1C] px-3 py-1 text-sm font-bold text-black shadow-lg transition duration-300 hover:bg-opacity-90 sm:px-4 sm:py-2 sm:text-base'
                onClick={handleModal}
            >
                {balance} {currency}
                <div
                    className={`ml-2 flex h-4 items-center justify-center transition-all duration-500 ease-in-out ${
                        showStatusText ? 'px-2' : 'w-4 px-0'
                    } rounded-full ${accountColor} overflow-hidden text-xs font-bold text-white`}
                    style={{
                        minWidth: showStatusText ? '50px' : '16px', // Smaller pill and dot size
                        maxWidth: showStatusText ? '40px' : '16px',
                        transition: 'all 0.5s ease-in-out',
                    }}
                >
                    {showStatusText && accountStatus}
                </div>
            </div>

            {/* Modal Component */}
            <Modal key={1} isClosed={!isModalOpen} setIsClosed={handleModal}>
                <div className='rounded-lg border-2 border-goldAli bg-[#1e1e2d] px-4 py-6 text-gray-300 shadow-lg sm:px-6 sm:py-8'>
                    <AccountSelector
                        sendMessage={sendMessage}
                        handleModal={handleModal}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default AccountInfoByBalance
