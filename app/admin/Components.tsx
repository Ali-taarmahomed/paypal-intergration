'use client'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { IoLogOutOutline } from 'react-icons/io5'
import Link from 'next/link'

export const AdminHeader = ({
    token,
    signature,
}: {
    token: string
    signature: string
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const myLinks = [
        { name: 'Dashboard', link: 'dashboard' },
        { name: 'Deposits', link: 'deposits' },
        { name: 'Withdrawals', link: 'withdrawal' },
        { name: 'Bots', link: 'bots' },
    ]

    return (
        <header className='flex items-center justify-between bg-goldAli p-4 text-white'>
            {/* Logo */}
            <div className='text-xl font-bold'>DTC Admin</div>

            {/* Desktop Sidebar (Left) */}
            <nav className='hidden space-x-6 md:flex'>
                {myLinks.map(value => {
                    return (
                        <Link
                            className='px-3 py-2 hover:underline'
                            key={value.name}
                            href={`/admin/${value.link}?token=${token}&signature=${signature}`}
                        >
                            {value.name}
                        </Link>
                    )
                })}

                <Link
                    className='flex items-center justify-center gap-1 rounded-lg bg-red-800 px-3 py-2 text-center text-gray-200 hover:bg-pink-600'
                    href={`/admin`}
                >
                    <IoLogOutOutline />
                    Logout
                </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            <div
                className={`fixed left-0 top-0 h-full w-64 transform bg-green-800 p-5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
            >
                <button
                    className='absolute right-4 top-4 text-white'
                    onClick={() => setIsOpen(false)}
                >
                    <X size={24} />
                </button>
                <nav className='mt-8 space-y-4 text-lg'>
                    {myLinks.map(value => {
                        return (
                            <Link
                                className='block hover:underline'
                                key={value.name}
                                href={`/admin/${value.link}?token=${token}&signature=${signature}`}
                            >
                                {value.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}

export const InvalidLogin = () => {
    return <div className='text-red-500'>Invalid Login</div>
}

export const AdminBalance = () => {
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    return (
        <div className='flex items-center justify-between bg-blue-800 px-3 py-2 text-gray-200'>
            <div className=''> {accountInfo.loginid}</div>

            <div className=''>
                {accountInfo.balance} {accountInfo.currency}
            </div>
        </div>
    )
}
