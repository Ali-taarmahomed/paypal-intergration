'use client'

export const Modal = ({
    isClosed,
    setIsClosed,
    children,
}: {
    isClosed: boolean
    setIsClosed: (modalState: boolean) => void
    children: React.ReactNode
}) => {
    function handleClose() {
        setIsClosed(true)
    }

    const blurBackground = !isClosed ? 'backdrop-blur' : ''
    return (
        !isClosed && (
            <div className='fixed inset-0 z-50 flex items-center justify-center p-1'>
                <div className='w-auto rounded-lg border-4 border-goldAli bg-blueAli p-4 shadow-xl'>
                    {children}

                    <div
                        onClick={handleClose}
                        className={`fixed inset-0 -z-10 bg-blueAli opacity-50 ${blurBackground}`}
                    ></div>
                </div>
            </div>
        )
    )
}
