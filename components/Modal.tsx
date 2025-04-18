'use client'

import { useRef } from 'react'

export const Modal = ({
    isClosed,
    setIsClosed,
    children,
}: {
    isClosed: boolean
    setIsClosed: (modalState: boolean) => void
    children: React.ReactNode
}) => {
    const modalRef = useRef<HTMLDivElement>(null)

    if (isClosed) return null

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center'
            onClick={() => setIsClosed(true)} // 👈 click anywhere closes modal
        >
            {/* Dark background */}
            <div className='absolute inset-0 z-40 bg-black opacity-80'></div>

            {/* Modal content */}
            <div
                ref={modalRef}
                className='relative z-50 max-h-[90vh] w-auto overflow-y-auto rounded-lg border-4 border-goldAli bg-blueAli p-4 shadow-xl'
                onClick={e => e.stopPropagation()} // 👈 stop click INSIDE modal from closing
            >
                {children}
            </div>
        </div>
    )
}
