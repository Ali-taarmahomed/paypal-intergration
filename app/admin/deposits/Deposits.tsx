'use client'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { CustomToast } from '@/components/CustomToast'
import { MyTable } from '@/components/MyTable'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import {
    adminApproveDeposits,
    adminDeleteDeposits,
    adminGetDeposits,
    DepositT,
} from '@/modules/cashier/action'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDerivWs } from '@/hooks/useDerivWs'
import { isValidLogin } from '../lib'
import { AdminBalance, AdminHeader, InvalidLogin } from '../Components'
import { Loading } from '@/components/Loading'

export const Deposits = () => {
    const [isDisabled, setIsDisabled] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [myData, setMyData] = useState<DepositT[]>([])
    const accountInfo = useSelector((state: RootState) => state.derivUser)

    const params = useGetQueryParams()
    let { token, signature } = params

    if (token === undefined || token === null) {
        token = accountInfo.token
    }
    const { sendMessage, isReady } = useDerivWs({
        token,
    })

    const sendTransferRequest = (
        amount: number,
        currency: string,
        clientLoginId: string
    ) => {
        sendMessage({
            paymentagent_transfer: 1,
            amount: amount,
            currency: currency,
            transfer_to: clientLoginId,
            // description: '', //optional
            // dry_run: 1, //optional   is for testing
        })
    }

    useEffect(() => {
        const fn = async () => {
            const data: any = await adminGetDeposits({
                isConfirmedByAdmin: isSuccessful,
            })
            setMyData(data)
        }

        fn()

        return () => {}
    }, [isSuccessful])

    if (!isReady) return <Loading />

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

            <div className='flex flex-col gap-2 px-2 md:px-4'>
                <CustomToast />

                <div className='grid grid-cols-2 gap-1'>
                    <div
                        onClick={() => {
                            setIsSuccessful(false)
                        }}
                        className='hover:pointer bg-goldAli py-2 text-center text-gray-50 hover:bg-amber-800'
                    >
                        Pending
                    </div>

                    <div
                        onClick={() => {
                            setIsSuccessful(true)
                        }}
                        className='hover:pointer bg-goldAli py-2 text-center text-gray-50 hover:bg-amber-800'
                    >
                        Successful
                    </div>
                </div>

                {/* table */}

                {(() => {
                    const newData: React.JSX.Element[] = []

                    for (let item of myData) {
                        // const data = {
                        //     id: item.id,
                        //     email: item.email,
                        //     loginId: item.loginId,
                        //     fullName: item.fullName,
                        //     whatsappNumber: item.whatsappNumber,
                        //     amountPaidInUsd: String(item.amountPaidInUsd),
                        //     agentFeeInUsd: String(item.agentFeeInUsd),
                        //     amountAfterFeeInUsd: String(
                        //         item.amountAfterFeeInUsd
                        //     ),
                        //     paymentMethod: item.paymentMethod,
                        //     isPaid: String(item.isPaid),
                        //     isConfirmedByAdmin: String(item.isConfirmedByAdmin),
                        //     upd: (
                        //         <button
                        //             onClick={async () => {
                        //                 if (isSuccessful) {
                        //                     toast.error('Operation Not Allowed')
                        //                     return
                        //                 }

                        //                 if (isDisabled) {
                        //                     toast.error(
                        //                         'This Might Cause Double Transfer'
                        //                     )
                        //                     return
                        //                 }

                        //                 if (
                        //                     accountInfo.balance <
                        //                     item.amountAfterFeeInUsd
                        //                 ) {
                        //                     toast.error(
                        //                         `Insufficient Funds! Your balance is ${accountInfo.balance} ${accountInfo.currency} and you are trying to transfer ${item.amountAfterFeeInUsd} ${accountInfo.currency}`
                        //                     )
                        //                     return
                        //                 }

                        //                 setIsDisabled(true)
                        //                 await adminApproveDeposits({
                        //                     depositId: item.id,
                        //                 })

                        //                 // send transfer request
                        //                 sendTransferRequest(
                        //                     item.amountAfterFeeInUsd,
                        //                     accountInfo.currency,
                        //                     item.loginId
                        //                 )
                        //                 window.location.reload()
                        //             }}
                        //             className='rounded bg-goldAli px-3 py-2 text-gray-50 hover:bg-amber-800'
                        //         >
                        //             Approve
                        //         </button>
                        //     ),
                        //     del: (
                        //         <button
                        //             onClick={async () => {
                        //                 if (isSuccessful) {
                        //                     toast.error('Operation Not Allowed')
                        //                     return
                        //                 }
                        //                 await adminDeleteDeposits({
                        //                     depositId: item.id,
                        //                 })
                        //                 window.location.reload()
                        //             }}
                        //             className='rounded bg-red-500 px-3 py-2 text-gray-50 hover:bg-red-800'
                        //         >
                        //             Decline
                        //         </button>
                        //     ),
                        // }

                        const data = (
                            <div
                                key={item.id}
                                className='w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-lg'
                            >
                                <div className='space-y-3'>
                                    <h3 className='text-lg font-semibold text-gray-800'>
                                        {item.fullName}
                                    </h3>
                                    <p className='text-sm text-gray-600'>
                                        Email: {item.email}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Login ID: {item.loginId}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        WhatsApp: {item.whatsappNumber}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Amount Paid: ${item.amountPaidInUsd}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Agent Fee: ${item.agentFeeInUsd}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Amount After Fee: $
                                        {item.amountAfterFeeInUsd}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        Payment Method: {item.paymentMethod}
                                    </p>
                                    {/* <p className="text-sm text-gray-600">Paid: {item.isPaid ? "Yes" : "No"}</p> */}
                                    <p className='text-sm text-gray-600'>
                                        Confirmed:
                                        {item.isConfirmedByAdmin ? (
                                            <span className='rounded bg-green-500 p-1 text-gray-50'>
                                                Yes
                                            </span>
                                        ) : (
                                            <span className='rounded bg-red-500 p-1 text-gray-50'>
                                                No
                                            </span>
                                        )}{' '}
                                    </p>

                                    {!isSuccessful && (
                                        <div className='grid w-full grid-cols-2 gap-2 py-4'>
                                            <button
                                                onClick={async () => {
                                                    if (isSuccessful) {
                                                        toast.error(
                                                            'Operation Not Allowed'
                                                        )
                                                        return
                                                    }
                                                    await adminDeleteDeposits({
                                                        depositId: item.id,
                                                    })
                                                    window.location.reload()
                                                }}
                                                className='rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-800'
                                            >
                                                Decline
                                            </button>

                                            <button
                                                onClick={async () => {
                                                    if (isSuccessful) {
                                                        toast.error(
                                                            'Operation Not Allowed'
                                                        )
                                                        return
                                                    }

                                                    if (isDisabled) {
                                                        toast.error(
                                                            'This Might Cause Double Transfer'
                                                        )
                                                        return
                                                    }

                                                    if (
                                                        accountInfo.balance <
                                                        item.amountAfterFeeInUsd
                                                    ) {
                                                        toast.error(
                                                            `Insufficient Funds! Your balance is ${accountInfo.balance} ${accountInfo.currency} and you are trying to transfer ${item.amountAfterFeeInUsd} ${accountInfo.currency}`
                                                        )
                                                        return
                                                    }

                                                    setIsDisabled(true)
                                                    await adminApproveDeposits({
                                                        depositId: item.id,
                                                    })

                                                    // send transfer request
                                                    sendTransferRequest(
                                                        item.amountAfterFeeInUsd,
                                                        accountInfo.currency,
                                                        item.loginId
                                                    )
                                                    window.location.reload()
                                                }}
                                                className='rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-800'
                                            >
                                                Approve{' '}
                                                {item.amountAfterFeeInUsd}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                        newData.push(data)
                    }

                    if (newData.length > 0)
                        return (
                            <div className='grid-col-1 mt-4 grid gap-4 md:mt-0 md:grid-cols-3 md:gap-2'>
                                {newData}
                            </div>
                        )

                    // if (newData.length > 0)
                    //     return (
                    //         <MyTable
                    //             title={
                    //                 isSuccessful
                    //                     ? 'Successful Deposits'
                    //                     : 'Pending Deposits'
                    //             }
                    //             data={newData}
                    //         />
                    //     )

                    return (
                        <div className='flex items-center justify-center py-8 text-lg font-extrabold text-red-500'>
                            No{' '}
                            {isSuccessful
                                ? 'Successful Deposits'
                                : 'Pending Deposits'}
                            !
                        </div>
                    )
                })()}
            </div>
        </>
    )
}
