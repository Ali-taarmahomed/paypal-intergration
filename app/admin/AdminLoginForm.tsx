'use client'

import { adminLogin } from '@/modules/cashier/action'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

export const AdminLoginForm = () => {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [loginId, setLoginId] = useState('')
    const [token, setToken] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className='flex h-screen w-full items-center justify-center px-4'>
            <div className='flex w-full flex-col items-center justify-center gap-5 rounded-lg bg-gray-200 px-6 py-16 shadow-lg md:w-1/2 lg:w-1/3'>
                <h1 className='pb-6 text-xl font-bold uppercase text-blueAli'>
                    DollarTradeClub AI ADMIN
                </h1>
                <form
                    className='flex w-full flex-col items-center justify-start gap-4 px-2 md:px-4'
                    onSubmit={async e => {
                        e.preventDefault()
                        const res = await adminLogin({
                            email,
                            loginId,
                            password,
                        })

                        if (res.status == 'success') {
                            router.push(
                                `/admin/accounts?signature=${res.signature}&acct1=Token&token1=${token}&cur1=USD`
                            )
                            return
                        }

                        toast.error(res.message)
                    }}
                >
                    <div className='flex w-full flex-col gap-1'>
                        <label className='pl-2' htmlFor='email'>
                            Email
                        </label>
                        <input
                            className='rounded-lg border border-goldAli px-3 py-2 text-blueAli md:py-4'
                            type='email'
                            name='email'
                            defaultValue={email}
                            value={email}
                            onChange={e => {
                                const email = e.currentTarget.value
                                setEmail(email)
                            }}
                            placeholder='Enter Email'
                            required
                        />
                    </div>

                    <div className='flex w-full flex-col gap-1'>
                        <label className='pl-2' htmlFor='email'>
                            LoginId
                        </label>
                        <input
                            className='rounded-lg border border-goldAli px-3 py-2 text-blueAli md:py-4'
                            type='loginId'
                            name='loginId'
                            defaultValue={loginId}
                            value={loginId}
                            onChange={e => {
                                const loginId = e.currentTarget.value
                                setLoginId(loginId)
                            }}
                            placeholder='Enter LoginId'
                            required
                        />
                    </div>

                    <div className='flex w-full flex-col gap-1'>
                        <label className='pl-2' htmlFor='email'>
                            Token
                        </label>
                        <input
                            className='rounded-lg border border-goldAli px-3 py-2 text-blueAli md:py-4'
                            type='token'
                            name='token'
                            defaultValue={token}
                            value={token}
                            onChange={e => {
                                const token = e.currentTarget.value
                                setToken(token)
                            }}
                            placeholder='Enter Token'
                            required
                        />
                    </div>

                    <div className='flex w-full flex-col gap-1'>
                        <label className='pl-2' htmlFor='password'>
                            Password
                        </label>
                        <input
                            className='rounded-lg border border-goldAli px-3 py-2 text-blueAli md:py-4'
                            type='password'
                            name='password'
                            defaultValue={password}
                            value={password}
                            onChange={e => {
                                const password = e.currentTarget.value
                                setPassword(password)
                            }}
                            placeholder='Enter password'
                            required
                        />
                    </div>

                    <div className='w-full items-center'>
                        <button
                            className='w-full rounded-lg bg-blueAli px-4 py-2 font-bold text-white hover:bg-blueAli md:py-4'
                            type='submit'
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
