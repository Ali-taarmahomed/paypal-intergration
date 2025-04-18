'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { Modal } from '@/components/Modal'
import {
    BankDetailsT,
    getBankDetails,
    saveBankDetails,
    updateBankDetails,
} from '@/modules/cashier/action'
import BankDetailsDisplay from './BankDetailsDisplay'
import Loader from '@/components/Loader'

export type AccountTypeT = 'Cheque' | 'Savings' | 'None'

export const BankDetails = ({
    paymentMethod,
    bankRef,
    isBankModalOpen,
    setIsBankModalOpen,
    setIsWithdrawalModalOpen,
    setIsConfirmShown,
}: {
    paymentMethod: string
    bankRef: React.RefObject<HTMLDivElement>
    isBankModalOpen: boolean
    setIsBankModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsWithdrawalModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setIsConfirmShown: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const [email, setEmail] = useState(accountInfo.email)
    const [loginId, setLoginId] = useState(accountInfo.loginid)
    const [fullName, setFullName] = useState(accountInfo.fullname)
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountHoldersName, setAccountHoldersName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountType, setAccountType] = useState<AccountTypeT>('None')
    const [branchCode, setBranchCode] = useState('')
    const [paypalEmail, setPaypalEmail] = useState('')
    const [usdtTrc20Address, setUsdtTrc20Address] = useState('')
    const [eWalletMobile, setEWalletMobile] = useState('')

    const resetStates = () => {
        setBankName('')
        setAccountHoldersName('')
        setAccountNumber('')
        setAccountType('None')
        setBranchCode('')
        setPaypalEmail('')
        setUsdtTrc20Address('')
        setEWalletMobile('')
    }

    return (
        <Modal
            key={3}
            isClosed={!isBankModalOpen}
            setIsClosed={setIsBankModalOpen}
        >
            <div
                ref={bankRef}
                className='max-h-[80vh] overflow-y-auto rounded-lg bg-[#1A1B25] p-4 text-gray-300'
            >
                <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                    Set Payment Method
                </h2>

                <div className='mt-4 flex flex-col gap-4'>
                    {(() => {
                        switch (paymentMethod) {
                            case 'Bank':
                                return (
                                    <>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Bank Name
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setBankName(value)
                                                }}
                                                value={bankName}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Bank Name'
                                            />
                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Account Type
                                            </label>
                                            <select
                                                className={
                                                    'w-full rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                }
                                                onChange={e => {
                                                    const paymentMethod = e
                                                        .currentTarget
                                                        .value as AccountTypeT
                                                    setAccountType(
                                                        paymentMethod
                                                    )
                                                }}
                                            >
                                                {['Cheque', 'Savings'].map(
                                                    value => {
                                                        if (
                                                            value ==
                                                            String(accountType)
                                                        ) {
                                                            return (
                                                                <option
                                                                    selected
                                                                    key={value}
                                                                    defaultValue={
                                                                        value
                                                                    }
                                                                    value={
                                                                        value
                                                                    }
                                                                >
                                                                    {value}
                                                                </option>
                                                            )
                                                        }
                                                        return (
                                                            <option
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {value}
                                                            </option>
                                                        )
                                                    }
                                                )}
                                            </select>
                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Bank Holders Name
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setAccountHoldersName(value)
                                                }}
                                                value={accountHoldersName}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Bank Holders Name'
                                            />
                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Bank Account Number
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setAccountNumber(value)
                                                }}
                                                value={accountNumber}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Bank Account Number'
                                            />
                                        </div>

                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Branch Code
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setBranchCode(value)
                                                }}
                                                value={branchCode}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Branch Code'
                                            />
                                        </div>
                                    </>
                                )
                            case 'Paypal':
                                return (
                                    <>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Paypal Email
                                            </label>
                                            <input
                                                type='email'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setPaypalEmail(value)
                                                }}
                                                value={paypalEmail}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Paypal Email'
                                            />
                                        </div>
                                    </>
                                )
                            case 'E-Wallet':
                                return (
                                    <>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                E-Wallet PhoneNumber
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setEWalletMobile(value)
                                                }}
                                                value={eWalletMobile}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter E-Wallet PhoneNumber'
                                            />
                                        </div>
                                    </>
                                )
                            case 'Crypto_USDT(TRC20)':
                                return (
                                    <>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                USDT(TRC20) Wallet Address
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setUsdtTrc20Address(value)
                                                }}
                                                value={usdtTrc20Address}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter USDT(TRC20) Wallet Address'
                                            />
                                        </div>
                                    </>
                                )
                            default:
                                return (
                                    <div className='rounded bg-red-100 p-4'>
                                        Please select a payment method.
                                    </div>
                                )
                        }
                    })()}

                    <div className='flex flex-col'>
                        <label className='text-left capitalize'>
                            Whatsapp Number
                        </label>
                        <input
                            type='text'
                            onChange={e => {
                                const value = e.target.value
                                setWhatsappNumber(value)
                            }}
                            value={whatsappNumber}
                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                            placeholder='Enter Whatsapp Number'
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        <div className=''>
                            <button
                                onClick={async () => {
                                    const myData = {
                                        email,
                                        loginId,
                                        fullName,
                                        whatsappNumber,
                                        paymentMethod,
                                        bankName,
                                        accountHoldersName,
                                        accountNumber,
                                        accountType,
                                        branchCode,
                                        paypalEmail,
                                        usdtTrc20Address,
                                        eWalletMobile,
                                    }
                                    await saveBankDetails(myData)
                                    setIsBankModalOpen(false)
                                    setIsWithdrawalModalOpen(true)
                                    setIsConfirmShown(true)

                                    resetStates()
                                }}
                                className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                            >
                                Save & Withraw
                            </button>
                        </div>

                        <div className=''>
                            <button
                                onClick={() => {
                                    setIsBankModalOpen(false)
                                }}
                                className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export const UpdateBankDetails = ({
    paymentMethod,
}: {
    paymentMethod: string
}) => {
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const [email, setEmail] = useState(accountInfo.email)
    const [loginId, setLoginId] = useState(accountInfo.loginid)
    const [fullName, setFullName] = useState(accountInfo.fullname)
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountHoldersName, setAccountHoldersName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountType, setAccountType] = useState<AccountTypeT>('None')
    const [branchCode, setBranchCode] = useState('')
    const [paypalEmail, setPaypalEmail] = useState('')
    const [usdtTrc20Address, setUsdtTrc20Address] = useState('')
    const [eWalletMobile, setEWalletMobile] = useState('')
    const [myData, setMyData] = useState<BankDetailsT[]>([])
    const [isEdit, setIsEdit] = useState(false)
    const [isFetched, setIsFetched] = useState(false)

    useEffect(() => {
        const fn = async () => {
            const data: any = await getBankDetails({
                email: accountInfo.email,
                loginId: accountInfo.loginid,
                paymentMethod: paymentMethod,
            })

            setMyData(data)
            setIsFetched(true)

            myData.map(bankData => {
                setWhatsappNumber(bankData.whatsappNumber)
                setBankName(bankData.bankName)
                setAccountHoldersName(bankData.accountHoldersName)
                setAccountNumber(bankData.accountNumber)
                setBranchCode(bankData.branchCode)
                setPaypalEmail(bankData.paypalEmail)
                setUsdtTrc20Address(bankData.usdtTrc20Address)
                setEWalletMobile(bankData.eWalletMobile)
            })
        }

        fn()

        return () => {}
    }, [paymentMethod, accountInfo.loginid, isEdit])

    if (myData.length == 0 && isFetched == false) return <Loader />

    return (
        <>
            {isEdit ? (
                myData.map((bankData, index) => {
                    return (
                        <div
                            key={index}
                            className='rounded-lg border bg-blueAli px-3 py-4 md:py-8'
                        >
                            <h2 className='text-md text-center font-bold uppercase text-goldAli'>
                                Update Payment Method
                            </h2>

                            <div className='mt-4 flex flex-col gap-4'>
                                {(() => {
                                    switch (paymentMethod) {
                                        case 'Bank':
                                            return (
                                                <>
                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            Bank Name
                                                        </label>
                                                        <input
                                                            type='text'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setBankName(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.bankName
                                                            }
                                                            value={bankName}
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter Bank Name'
                                                        />
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            Account Type
                                                        </label>
                                                        <select
                                                            className={
                                                                'w-full rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            }
                                                            onChange={e => {
                                                                const paymentMethod =
                                                                    e
                                                                        .currentTarget
                                                                        .value as AccountTypeT
                                                                setAccountType(
                                                                    paymentMethod
                                                                )
                                                            }}
                                                        >
                                                            {[
                                                                'Cheque',
                                                                'Savings',
                                                            ].map(value => {
                                                                if (
                                                                    value ==
                                                                    String(
                                                                        bankData.accountType
                                                                    )
                                                                ) {
                                                                    return (
                                                                        <option
                                                                            selected
                                                                            key={
                                                                                value
                                                                            }
                                                                            defaultValue={
                                                                                value
                                                                            }
                                                                            value={
                                                                                value
                                                                            }
                                                                        >
                                                                            {
                                                                                value
                                                                            }
                                                                        </option>
                                                                    )
                                                                }
                                                                return (
                                                                    <option
                                                                        key={
                                                                            value
                                                                        }
                                                                        value={
                                                                            value
                                                                        }
                                                                    >
                                                                        {value}
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            Bank Holders Name
                                                        </label>
                                                        <input
                                                            type='text'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setAccountHoldersName(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.accountHoldersName
                                                            }
                                                            value={
                                                                accountHoldersName
                                                            }
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter Bank Holders Name'
                                                        />
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            Bank Account Number
                                                        </label>
                                                        <input
                                                            type='text'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setAccountNumber(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.accountNumber
                                                            }
                                                            value={
                                                                accountNumber
                                                            }
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter Bank Account Number'
                                                        />
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            Branch Code
                                                        </label>
                                                        <input
                                                            type='text'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setBranchCode(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.branchCode
                                                            }
                                                            value={branchCode}
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter Branch Code'
                                                        />
                                                    </div>
                                                </>
                                            )
                                        case 'Paypal':
                                            return (
                                                <>
                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            Paypal Email
                                                        </label>
                                                        <input
                                                            type='email'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setPaypalEmail(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.paypalEmail
                                                            }
                                                            value={paypalEmail}
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter Paypal Email'
                                                        />
                                                    </div>
                                                </>
                                            )
                                        case 'E-Wallet':
                                            return (
                                                <>
                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            E-Wallet PhoneNumber
                                                        </label>
                                                        <input
                                                            type='text'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setEWalletMobile(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.eWalletMobile
                                                            }
                                                            value={
                                                                eWalletMobile
                                                            }
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter E-Wallet PhoneNumber'
                                                        />
                                                    </div>
                                                </>
                                            )
                                        case 'Crypto_USDT(TRC20)':
                                            return (
                                                <>
                                                    <div className='flex flex-col'>
                                                        <label className='text-left capitalize'>
                                                            USDT(TRC20) Wallet
                                                            Address
                                                        </label>
                                                        <input
                                                            type='text'
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value
                                                                setUsdtTrc20Address(
                                                                    value
                                                                )
                                                            }}
                                                            defaultValue={
                                                                bankData.usdtTrc20Address
                                                            }
                                                            value={
                                                                usdtTrc20Address
                                                            }
                                                            className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                            placeholder='Enter USDT(TRC20) Wallet Address'
                                                        />
                                                    </div>
                                                </>
                                            )
                                        default:
                                            return (
                                                <div className='rounded bg-red-100 p-4'>
                                                    Please select a payment
                                                    method.
                                                </div>
                                            )
                                    }
                                })()}

                                <div className='flex flex-col'>
                                    <label className='text-left capitalize'>
                                        Whatsapp Number
                                    </label>
                                    <input
                                        type='text'
                                        onChange={e => {
                                            const value = e.target.value
                                            setWhatsappNumber(value)
                                        }}
                                        defaultValue={whatsappNumber}
                                        value={whatsappNumber}
                                        className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                        placeholder='Enter Whatsapp Number'
                                    />
                                </div>

                                <div className='grid grid-cols-1 gap-2'>
                                    <div className=''>
                                        <button
                                            onClick={async () => {
                                                const myData = {
                                                    email,
                                                    loginId,
                                                    fullName,
                                                    whatsappNumber,
                                                    paymentMethod,
                                                    bankName,
                                                    accountHoldersName,
                                                    accountNumber,
                                                    accountType,
                                                    branchCode,
                                                    paypalEmail,
                                                    usdtTrc20Address,
                                                    eWalletMobile,
                                                }
                                                setIsEdit(prev => !prev)
                                                await updateBankDetails(myData)
                                            }}
                                            className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            ) : myData.length > 0 && isFetched ? (
                <div className='flex flex-col items-center justify-center rounded-lg border bg-blueAli py-4'>
                    {myData.map((bankData, index) => {
                        return (
                            <BankDetailsDisplay
                                key={index}
                                data={[
                                    {
                                        paymentMethod: bankData.paymentMethod,
                                        bankName: bankData.bankName,
                                        accountHoldersName:
                                            bankData.accountHoldersName,
                                        accountNumber: bankData.accountNumber,
                                        accountType: bankData.accountType,
                                        branchCode: bankData.branchCode,
                                        paypalEmail: bankData.paypalEmail,
                                        usdtTrc20Address:
                                            bankData.usdtTrc20Address,
                                        eWalletMobile: bankData.eWalletMobile,
                                    },
                                ]}
                            />
                        )
                    })}

                    <div className='flex items-center justify-center'>
                        <button
                            className='rounded bg-goldAli px-3 py-2 text-gray-50 hover:bg-opacity-80'
                            onClick={() => {
                                setIsEdit(prev => !prev)
                            }}
                        >
                            Edit Withdrawal Details
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}
