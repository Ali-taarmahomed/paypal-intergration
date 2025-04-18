'use client'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Image from 'next/image'

export const AccountSelector = ({
    sendMessage,
    handleModal,
}: {
    sendMessage: (message: Record<string, unknown>) => void
    handleModal: () => void
}) => {
    const derivAccounts = useSelector((state: RootState) => state.accounts)
    const { loginid, is_virtual } = useSelector(
        (state: RootState) => state.derivUser
    )

    // Determine account status
    const getAccountStatus = (code: string): string => {
        if (code.startsWith('CR')) return 'Real'
        if (code.startsWith('VRT')) return 'Demo'
        if (code.toLowerCase().includes('token')) return 'API Token'
        return 'Unknown'
    }

    const handleClick = (token: string, isDemo: boolean) => {
        if (!isDemo) {
            toast.error('Please select a demo account to reset the balance')
        } else {
            sendMessage({
                topup_virtual: 1,
                passthrough: {
                    is_virtual_hook: false,
                },
            })
            handleModal()
        }
    }

    const handleAccountSwitch = (token: string) => {
        const newUrl = `${window.location.pathname}?token=${token}`
        window.location.href = newUrl
    }

    return (
        <div className='flex flex-col gap-4'>
            {/* Optimized Image at the top */}
            <div className='flex justify-center'>
                <Image
                    src='/settings.png' // Update the image path if necessary
                    alt='Settings Icon'
                    width={64}
                    height={64}
                    quality={100}
                />
            </div>
            <h2 className='mb-4 text-center text-2xl font-bold text-goldAli'>
                Select an Account
            </h2>
            <div className='flex flex-col gap-2'>
                {Object.keys(derivAccounts)
                    .map(value => {
                        const acc = derivAccounts[value]
                        if (acc.code === loginid) return null
                        if (acc.code === '' || acc.token === '') return null
                        if (typeof acc.currency === 'undefined') return null

                        const accountStatus = getAccountStatus(acc.code)

                        return (
                            <button
                                className='flex w-full items-center justify-between rounded-lg bg-goldAli px-4 py-3 text-left font-bold text-black transition duration-300 ease-in-out hover:bg-blue-600'
                                key={acc.code}
                                onClick={() => handleAccountSwitch(acc.token)}
                            >
                                <div>
                                    {acc.code} ({acc.currency})
                                </div>
                                <span className='badge bg-green-500'>
                                    {accountStatus}
                                </span>
                            </button>
                        )
                    })
                    .filter(value => value !== null)}
            </div>
            <div className='mt-4 flex flex-col items-center justify-center gap-4'>
                <button
                    className='w-full rounded bg-green-500 px-4 py-3 font-bold text-white transition-opacity duration-300 hover:opacity-80'
                    onClick={() => handleClick(loginid, is_virtual)}
                >
                    Reset Demo
                </button>
                <button
                    className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                    onClick={handleModal}
                >
                    Close
                </button>
            </div>

            {/* Styling */}
            <style jsx>{`
                .badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: bold;
                    color: #ffffff;
                    text-align: center;
                }

                .bg-green-500 {
                    background-color: #22c55e; /* Green for all statuses */
                }
            `}</style>
        </div>
    )
}

export default AccountSelector
