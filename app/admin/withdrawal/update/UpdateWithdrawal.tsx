'use client'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import {
    adminApproveWithdrawals,
    adminGetBankDetails,
    BankDetailsT,
} from '@/modules/cashier/action'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { isValidLogin } from '../../lib'
import { AdminBalance, AdminHeader, InvalidLogin } from '../../Components'

export const UpdateWithdrawal = () => {
    const router = useRouter()
    const {
        id,
        email,
        loginId,
        fullName,
        amountWithdrawnInUsd,
        agentFeeInUsd,
        amountAfterFeeInUsd,
        paymentMethod,
        transactionCode,
        isConfirmedByAdmin,
        bankDetailsId,
        token,
        signature,
    } = useGetQueryParams()
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const [myData, setMyData] = useState<BankDetailsT[]>([])

    useEffect(() => {
        const fn = async () => {
            const data: any = await adminGetBankDetails({ bankDetailsId })
            setMyData(data)
        }

        fn()

        return () => {}
    }, [bankDetailsId])

    if (
        !isValidLogin(
            { email: accountInfo.email, loginId: accountInfo.loginid },
            signature
        )
    )
        return <InvalidLogin />

    return (
        <>
            <AdminHeader token={token} signature={signature} />
            <AdminBalance />

            <div className='pt-8'>
                {/* bank details */}
                {(() => {
                    if (myData.length == 0) return <>Loading Bank Details</>

                    const {
                        paymentMethod,
                        bankName,
                        accountHoldersName,
                        accountNumber,
                        accountType,
                        branchCode,
                        paypalEmail,
                        usdtTrc20Address,
                        eWalletMobile,
                    } = myData[0]

                    return (
                        <div className='mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg'>
                            <h2 className='mb-4 text-lg font-semibold text-gray-800'>
                                Payment Details - {paymentMethod}
                            </h2>

                            <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
                                <div className='col-span-2 flex justify-between font-medium'>
                                    <span>Payment Method:</span>
                                    <span>{paymentMethod}</span>
                                </div>
                                {(() => {
                                    switch (paymentMethod) {
                                        case 'Bank':
                                            return (
                                                <>
                                                    <div className='col-span-2 flex justify-between font-medium'>
                                                        <span>Bank Name:</span>
                                                        <span>{bankName}</span>
                                                    </div>
                                                    <div className='col-span-2 flex justify-between font-medium'>
                                                        <span>
                                                            Account Holder:
                                                        </span>
                                                        <span>
                                                            {accountHoldersName}
                                                        </span>
                                                    </div>
                                                    <div className='col-span-2 flex justify-between font-medium'>
                                                        <span>
                                                            Account Number:
                                                        </span>
                                                        <span>
                                                            {accountNumber}
                                                        </span>
                                                    </div>
                                                    <div className='col-span-2 flex justify-between font-medium'>
                                                        <span>
                                                            Account Type:
                                                        </span>
                                                        <span>
                                                            {accountType}
                                                        </span>
                                                    </div>
                                                    <div className='col-span-2 flex justify-between font-medium'>
                                                        <span>
                                                            Branch Code:
                                                        </span>
                                                        <span>
                                                            {branchCode}
                                                        </span>
                                                    </div>
                                                </>
                                            )

                                        case 'Paypal':
                                            return (
                                                <div className='col-span-2 flex justify-between font-medium'>
                                                    <span>PayPal Email:</span>
                                                    <span>{paypalEmail}</span>
                                                </div>
                                            )

                                        case 'E-Wallet':
                                            return (
                                                <div className='col-span-2 flex justify-between font-medium'>
                                                    <span>
                                                        E-Wallet Mobile:
                                                    </span>
                                                    <span>{eWalletMobile}</span>
                                                </div>
                                            )

                                        case 'Crypto_USDT(TRC20)':
                                            return (
                                                <div className='col-span-2 flex justify-between font-medium'>
                                                    <span>
                                                        USDT TRC20 Address:
                                                    </span>
                                                    <span>
                                                        {usdtTrc20Address}
                                                    </span>
                                                </div>
                                            )

                                        default:
                                            return (
                                                <div className='col-span-2 flex justify-between font-medium'>
                                                    <span>Payment Method:</span>
                                                    <span>Not Available</span>
                                                </div>
                                            )
                                    }
                                })()}

                                {/* Info Grid */}
                                <div className='col-span-2 flex justify-between font-medium'>
                                    <span>Email:</span>
                                    <span>{email}</span>
                                </div>

                                <div className='col-span-2 flex justify-between font-medium'>
                                    <span>Login ID:</span>
                                    <span>{loginId}</span>
                                </div>

                                <div className='col-span-2 flex justify-between font-medium'>
                                    <span>Full Name:</span>
                                    <span>{fullName}</span>
                                </div>

                                {/* <div className='col-span-2 flex justify-between font-medium'>
                    <span>Transaction Code:</span>
                    <span>{transactionCode}</span>
                </div> */}

                                <div className='col-span-2 flex justify-between font-medium text-green-600'>
                                    <span>Withdrawn:</span>
                                    <span>${amountWithdrawnInUsd}</span>
                                </div>

                                <div className='col-span-2 flex justify-between font-medium text-red-500'>
                                    <span>Agent Fee:</span>
                                    <span>${agentFeeInUsd}</span>
                                </div>

                                <div className='col-span-2 flex justify-between font-medium text-blue-600'>
                                    <span>After Fee:</span>
                                    <span>${amountAfterFeeInUsd}</span>
                                </div>

                                {/* <div className='col-span-2 flex justify-between font-medium'>
                    <span>Bank Details ID:</span>
                    <span>{bankDetailsId}</span>
                </div> */}

                                {/* Confirmation Status */}
                                <div className='col-span-2 flex justify-between font-medium'>
                                    <span className='text-sm text-gray-500'>
                                        Status:
                                    </span>
                                    {isConfirmedByAdmin == 'true' ? (
                                        <span className='flex items-center font-medium text-green-600'>
                                            <CheckCircle
                                                size={18}
                                                className='mr-1'
                                            />{' '}
                                            Confirmed
                                        </span>
                                    ) : (
                                        <span className='flex items-center font-medium text-red-500'>
                                            <XCircle
                                                size={18}
                                                className='mr-1'
                                            />{' '}
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className='mt-4 flex w-full items-center justify-between py-4'>
                                <button
                                    onClick={async () => {
                                        await adminApproveWithdrawals({
                                            withdrawalId: id,
                                            transactionCode: '',
                                        })
                                        router.push(
                                            `/admin/withdrawal?token=${token}&signature=${signature}`
                                        )
                                    }}
                                    className='w-full rounded bg-green-500 px-3 py-2 text-gray-50 hover:bg-green-800'
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    )

                    return <></>
                })()}
            </div>
        </>
    )
}
