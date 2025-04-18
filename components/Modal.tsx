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
        <>
            {/* ✅ Backdrop that closes modal on click */}
            <div
                className='fixed inset-0 z-40 bg-black opacity-80'
                onClick={() => setIsClosed(true)}
            />

            {/* ✅ Modal content on top */}
            <div className='fixed inset-0 z-50 flex items-center justify-center p-2'>
                <div
                    ref={modalRef}
                    onClick={e => e.stopPropagation()}
                    className='max-h-[90vh] w-auto overflow-y-auto rounded-lg border-4 border-goldAli bg-blueAli p-4 shadow-xl'
                >
                    {children}
                </div>
            </div>
        </>
    )
}
