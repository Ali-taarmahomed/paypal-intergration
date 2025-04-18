'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import Loader from '@/components/Loader'
import { FaTimesCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { usePayPalStatusSender } from '@/hooks/usePayPalStatusSender'

export const PaymentCancelledModal: React.FC = () => {
    usePayPalStatusSender()

    const router = useRouter()
    const [isOpen, setIsOpen] = useState(true) // Default to true to simulate open modal
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const redirectToCashier = (token: string) => {
        router.push(`/cashier?token=${token}`)
    }

    useEffect(() => {
        // Automatically close the modal after 5 seconds
        setTimeout(() => {
            redirectToCashier(accountInfo.token)
        }, 5000)
    }, [])

    if (!isOpen) return <Loader />
    if (accountInfo.token == '') return <Loader />

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50'>
            <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
                <div className='mb-4 flex justify-center'>
                    <FaTimesCircle className='text-6xl text-red-600' />
                </div>
                <h2 className='text-center text-2xl font-bold text-red-600'>
                    Payment Cancelled
                </h2>
                <p className='mt-2 text-center text-gray-600'>
                    Your payment has been cancelled. You can return to the
                    cashier to try again.
                </p>
                <div className='mt-4 flex justify-center gap-4'>
                    <button
                        onClick={() => {
                            redirectToCashier(accountInfo.token)
                        }}
                        className='rounded-md bg-red-500 px-4 py-2 text-white'
                    >
                        Go to Cashier
                    </button>
                </div>
            </div>
        </div>
    )
}
