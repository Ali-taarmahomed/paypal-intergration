// page.tsx

'use client' // Add this line at the very top

import { Suspense, useState, useEffect } from 'react'
import { Bots } from './Bots'
import { CustomToast } from '@/components/CustomToast'
import Loader from '@/components/Loader' // Corrected import based on your path

const Page = () => {
    const [showMask, setShowMask] = useState(true)

    useEffect(() => {
        // Show the mask for a fixed duration (e.g., 1 second)
        const timer = setTimeout(() => {
            setShowMask(false)
        }, 900) // 1000ms (1 second) to show the mask

        return () => clearTimeout(timer) // Clean up the timer on unmount
    }, [])

    return (
        <>
            {showMask && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#1A1B25]'>
                    <Loader />
                </div>
            )}
            {/* Actual page content is rendered here but masked initially */}
            <div style={{ visibility: showMask ? 'hidden' : 'visible' }}>
                <Suspense fallback={<Loader />}>
                    <Bots />
                    <CustomToast />
                </Suspense>
            </div>
        </>
    )
}

export default Page
