'use client'

import {
    useGetLastVisitedPath,
    useSaveLastVisitedPath,
} from '@/hooks/useCleanPath'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaUserSlash } from 'react-icons/fa6'

const PathsBg = {
    default: '/aviatorFeature.png',
    cashier: '/aviatorFeature.png',
    bots: '/aviatorFeature.png',
    aviator: '/aviatorFeature.png',
    accumulators: '/aviatorFeature.png',
    manual: '/aviatorFeature.png',
}

const keysPathsBg = Object.keys(PathsBg)
const valuesPathsBg = Object.values(PathsBg)

export const LoginWithDeriv: React.FC = () => {
    useSaveLastVisitedPath()
    const currentpage = useGetLastVisitedPath()

    const router = useRouter()
    const [isOpen, setIsOpen] = useState(true)
    const AppId = process.env.NEXT_PUBLIC_DERIV_APP_ID as string
    const AppUrl = process.env.NEXT_PUBLIC_DERIV_HTTP_URL as string
    const DerivAffUrl = process.env.NEXT_PUBLIC_DERIV_AFFILIATE_URL as string

    if (!isOpen) return null
    if (currentpage == null) return null

    const imgIndex = keysPathsBg.indexOf(currentpage.slice(1))

    const imgUrl = imgIndex == -1 ? valuesPathsBg[0] : valuesPathsBg[imgIndex]

    return (
        <div className='fixed inset-0 z-50'>
            {/* Background Image - Fit without cropping or zooming */}
            <div
                className='absolute inset-0 bg-contain bg-center bg-no-repeat'
                style={{
                    backgroundImage: String(`url('${imgUrl}')`),
                    backgroundColor: '#000', // fallback if image has empty areas
                }}
            ></div>

            {/* Optional: Dark overlay */}
            <div className='absolute inset-0 bg-black bg-opacity-60'></div>

            {/* Modal Content */}
            <div className='relative z-10 flex h-full items-center justify-center'>
                <div className='w-96 rounded-2xl bg-white p-6 shadow-lg'>
                    <div className='flex flex-col items-center'>
                        <FaUserSlash className='mb-4 text-6xl text-red-500' />
                        <h2 className='mb-2 text-2xl font-bold text-red-600'>
                            You are logged out
                        </h2>
                        <p className='mb-4 text-center text-gray-600'>
                            Please log in with your Deriv account to continue.
                        </p>
                        <Link
                            href={`${AppUrl}${AppId}`}
                            className='rounded-lg bg-red-500 px-6 py-2 text-white transition hover:bg-red-600'
                        >
                            Login with Deriv
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
