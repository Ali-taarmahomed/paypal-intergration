// page.tsx

'use client' // This ensures that we're using a client-side component

import { useState, useEffect } from 'react'
import { DerivWs } from './DerivWs'
import Loader from '@/components/Loader' // Corrected import path

const Page = () => {
    const [showMask, setShowMask] = useState(true)

    useEffect(() => {
        // Set the mask duration to 1 second
        const timer = setTimeout(() => {
            setShowMask(false)
        }, 2000) // 1000ms (1 second)

        return () => clearTimeout(timer) // Clean up the timer on unmount
    }, [])

    return (
        <>
            {showMask && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#1A1B25]'>
                    <Loader />
                </div>
            )}
            {/* The actual content is here but is masked initially */}
            <div style={{ visibility: showMask ? 'hidden' : 'visible' }}>
                <DerivWs />
            </div>
        </>
    )
}

export default Page
