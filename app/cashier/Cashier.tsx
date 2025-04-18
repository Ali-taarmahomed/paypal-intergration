'use client'
import React, { useEffect, useRef, useState } from 'react'
import BottomNav from '../BottomNavBar/bottomnavbar'
import AccountInfoByBalance from '../bots/AccountInfo'
import Loader from '@/components/Loader'
import NavBar from '../bots/NavBar'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/state/store'
import { useDerivWs } from '@/hooks/useDerivWs'
import { Modal } from '@/components/Modal'
import { CustomToast } from '@/components/CustomToast'
import { toast } from 'react-toastify'
import { paymentAgentsSettings } from '../../modules/cashier/settings'
import { PaypalForm } from './Paypal'
import { hashData } from '@/helper/hashing'
import {
    getBankDetails,
    getUserTransaction,
    saveDepositData,
    UserTransactionT,
} from '@/modules/cashier/action'
import { BankDetails, UpdateBankDetails } from './BankDetails'
import Payfast, { paymentMethods } from './Payfast'
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { RxCrossCircled } from 'react-icons/rx'
import {
    resetWithdrawData,
    saveWithdrawData,
} from '@/state/withdraw/withdrawSlice'
import { LoginWithDeriv } from '@/components/LoginWithDeriv'
import { Loading } from '@/components/Loading'
import { useSaveLastVisitedPath } from '@/hooks/useCleanPath'
import { Header } from '@/components/Header'
import Yoco from './Yoco'
import { useSearchParams } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa' // place this at the top of your file
import { useSpring, animated } from '@react-spring/web'

export const Cashier = () => {
    useSaveLastVisitedPath()
    const paymentagent_loginid = paymentAgentsSettings.payment_agent_loginId
    const randDollarEquivalent = useCurrencyConverter('USD', 'ZAR')
    const params = useGetQueryParams()
    let { token } = params

    const dispatch = useDispatch<AppDispatch>()

    const accountInfo = useSelector((state: RootState) => state.derivUser)
    const selectedAsset = useSelector(
        (state: RootState) => state.assetSelection
    )

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

    // withdrawal
    const withdrawRef = useRef<HTMLDivElement>(null)
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false)
    const [isVerificationShown, setIsVerificationShown] = useState(false)
    const [verificationCode, setVerificationCode] = useState<string>('')
    const [whatsappNumber, setWhatsappNumber] = useState<string>('')

    // bank modal
    const bankRef = useRef<HTMLDivElement>(null)
    const [isBankModalOpen, setIsBankModalOpen] = useState(false)

    // deposit
    const depositRef = useRef<HTMLDivElement>(null)
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [isConfirmShown, setIsConfirmShown] = useState(false)
    const [isSummary, setIsSummary] = useState(false)

    const transactionCode = useRef('None')

    const [amount, setAmount] = useState<number>(10)
    const [myData, setMyData] = useState<UserTransactionT[]>([])

    if (token === undefined || token === null) {
        token = accountInfo.token
    }

    const { sendMessage, isReady, getTicks } = useDerivWs({
        token,
    })

    useEffect(() => {
        const fn = async () => {
            const data: any = await getUserTransaction({
                loginId: accountInfo.loginid,
            })

            setMyData(data)
        }

        fn()

        return () => {}
    }, [accountInfo.loginid])

    //withdraw

    const sendEmailVerificationWithdrawalReq = () => {
        dispatch(resetWithdrawData())
        if (accountInfo.is_virtual) {
            toast.error('Withdrawal not allowed on demo account')
            setIsWithdrawalModalOpen(false)
            return
        }

        if (accountInfo.balance < paymentAgentsSettings.withdrawal.min) {
            toast.error(
                `Inssuficient Funds:your balance is ${accountInfo.balance}`
            )
            setIsWithdrawalModalOpen(false)
            return
        }

        if (amount < paymentAgentsSettings.withdrawal.min) {
            toast.error(
                `Minimum withdrawal is ${paymentAgentsSettings.withdrawal.min}`
            )
            setIsWithdrawalModalOpen(false)
            return
        }

        if (amount > paymentAgentsSettings.withdrawal.max) {
            toast.error(
                `Maximum withdrawal is ${paymentAgentsSettings.withdrawal.max}`
            )
            return
        }

        sendMessage({
            verify_email: accountInfo.email,
            type: 'paymentagent_withdraw', //payment_withdraw or paymentagent_withdraw
            // url_parameters:{custom1:accountInfo.loginid,custom2:accountInfo.token},//optional
        })

        const futureTimeStamp = Date.now() + 120 * 1000

        dispatch(
            saveWithdrawData({
                amountInUSD: amount,
                paymentMethod: selectedPaymentMethod,
                loginid: accountInfo.loginid,
                token: token,
                email: accountInfo.email,
                paymentagent_loginid:
                    paymentAgentsSettings.payment_agent_loginId,
                timeStamp: futureTimeStamp,
            })
        )

        setIsVerificationShown(prevState => true)
    }

    const sendWithdrawalReq = async () => {
        const currentTimeStamp = Date.now()
        transactionCode.current = `${currentTimeStamp}${accountInfo.loginid}`

        // Store in sessionStorage
        sessionStorage.setItem('lastTransactionCode', transactionCode.current)

        const dataToHash = {
            amountInUSD: amount,
            paymentMethod: selectedPaymentMethod,
            loginid: accountInfo.loginid,
            email: accountInfo.email,
            paymentagent_loginid: paymentagent_loginid,
        }

        const hashedData = await hashData(JSON.stringify(dataToHash))

        sendMessage({
            paymentagent_withdraw: 1,
            amount: amount,
            currency: accountInfo.currency,
            paymentagent_loginid: paymentagent_loginid,
            verification_code: verificationCode,
            passthrough: {
                whatsappNumber: whatsappNumber,
                amountInUSD: amount,
                paymentMethod: selectedPaymentMethod,
                loginid: accountInfo.loginid,
                email: accountInfo.email,
                paymentagent_loginid: paymentagent_loginid,
                signature: hashedData,
            },
        })

        setIsWithdrawalModalOpen(false)
        setIsVerificationShown(false)
    }

    const depositFee = paymentAgentsSettings.deposit.percentageFee * amount
    const withdrawalFee =
        paymentAgentsSettings.withdrawal.percentageFee * amount

    if (token === undefined || token === null || token === '') {
        return <LoginWithDeriv />
    }

    if (!isReady) {
        return <Loader />
    }

    if (randDollarEquivalent == null) {
        return <Loader />
    }

    const zarAmount = Math.floor(amount * randDollarEquivalent * 100) / 100

    const depositHandler = async () => {
        if (amount < paymentAgentsSettings.deposit.min) {
            toast.error(
                `Minimum Deposit is ${paymentAgentsSettings.deposit.min}`
            )

            return
        }
        setIsSummary(true)

        const currentTimeStamp = Date.now()

        transactionCode.current = String(
            `${currentTimeStamp}${accountInfo.loginid}`
        )

        sessionStorage.setItem('lastTransactionCode', transactionCode.current)

        await saveDepositData({
            email: accountInfo.email,
            loginId: accountInfo.loginid,
            fullName: accountInfo.fullname,
            whatsappNumber: whatsappNumber,
            amountPaidInUsd: amount,
            agentFeeInUsd: depositFee,
            amountAfterFeeInUsd: amount - depositFee,
            transactionCode: transactionCode.current,
            paymentMethod: selectedPaymentMethod,
            isPaid: false,
        })
    }

    const getPatmentMethod = async (myPaymentMethod: string) => {
        return await getBankDetails({
            email: accountInfo.email,
            loginId: accountInfo.loginid,
            paymentMethod: myPaymentMethod,
        })
    }

    const CurrencyComponent = ({ amount }: { amount: number }) => {
        const randDollarEquivalent = useCurrencyConverter('USD', 'ZAR') || 18
        const [targetText, setTargetText] = useState('')

        useEffect(() => {
            if (isNaN(amount) || amount <= 0) {
                setTargetText(`1 USD = R${randDollarEquivalent.toFixed(2)}`)
            } else {
                const usd = `$${amount.toFixed(2)}`
                const zar = `R${(amount * randDollarEquivalent).toFixed(2)}`
                setTargetText(`${usd} = ${zar}`)
            }
        }, [amount, randDollarEquivalent])

        return (
            <div className='my-4 rounded-xl border border-goldAli bg-[#141a26] px-4 py-3 text-center shadow-md'>
                <div className='flex justify-center gap-[2px] text-xl font-bold text-goldAli sm:text-2xl'>
                    {targetText.split('').map((char, i) => (
                        <div
                            key={i}
                            className='relative h-[1.6em] w-[1ch] overflow-hidden'
                        >
                            <div
                                className='animate-roll text-center'
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                {'0123456789.=RUSD$ '.split('').map((_, j) => (
                                    <div
                                        key={j}
                                        className='h-[1.6em] leading-[1.6em]'
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <style jsx>{`
                    .animate-roll {
                        display: flex;
                        flex-direction: column;
                        animation: spinDigit 0.5s ease-out;
                    }

                    @keyframes spinDigit {
                        0% {
                            transform: translateY(-100%);
                        }
                        100% {
                            transform: translateY(0%);
                        }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <>
            <Header token={token} />
            <div className='flex items-center justify-end px-3 py-4'>
                <AccountInfoByBalance sendMessage={sendMessage} />
            </div>
            <h1 className='mt-4 text-center text-3xl font-bold text-goldAli md:text-5xl'>
                DTC CASHIER
            </h1>

            <div className='grid grid-cols-1 gap-2 px-2 pt-8 md:grid-cols-2 md:px-8'>
                <div className='w-full'>
                    <button
                        onClick={() => {
                            if (accountInfo.is_virtual) {
                                toast.error(
                                    'Deposits not allowed on demo account'
                                )
                                setIsDepositModalOpen(false)
                                return
                            }

                            setIsDepositModalOpen(true)
                            setSelectedPaymentMethod(
                                paymentAgentsSettings.deposit.methods[0].name
                            )
                        }}
                        className='w-full rounded-lg bg-red-500 px-3 py-2 text-base font-bold text-gray-200 hover:bg-red-700 md:py-6 md:text-xl'
                    >
                        Deposit
                    </button>
                </div>

                <div className='w-full'>
                    <button
                        onClick={() => {
                            setIsWithdrawalModalOpen(true)
                            setSelectedPaymentMethod(
                                paymentAgentsSettings.withdrawal.methods[0].name
                            )
                        }}
                        className='w-full rounded-lg bg-green-500 px-3 py-2 text-base font-bold text-gray-200 hover:bg-green-700 md:py-6 md:text-xl'
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-2 px-3 py-2'>
                {myData.map((value, index) => {
                    return (
                        <TransactionsCard
                            key={index}
                            isDeposit={value.isDeposit}
                            amountUSD={value.amount}
                            exchangeRate={randDollarEquivalent}
                            isSuccessful={value.isSuccessful}
                            date={value.date}
                        />
                    )
                })}
            </div>

            <BottomNav token={token} />
            <CustomToast />

            {/* withdrawal modal */}

            <Modal
                key={1}
                isClosed={!isWithdrawalModalOpen}
                setIsClosed={setIsWithdrawalModalOpen}
            >
                <div
                    ref={withdrawRef}
                    className='max-h-[60vh] overflow-y-auto rounded-lg bg-[#1A1B25] p-4 text-gray-300'
                >
                    {/* withdraw */}

                    {isVerificationShown ? (
                        <>
                            {!isSummary ? (
                                <>
                                    <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                                        Withdraw by {selectedPaymentMethod}
                                    </h2>

                                    <div className='flex flex-col gap-1 px-2 py-8'>
                                        <div className='my-2 flex justify-between'>
                                            <div className='text-white'>
                                                Withdrawal Amount
                                            </div>
                                            <div className='text-white'>
                                                ${amount.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className='my-2 flex justify-between'>
                                            <div className='text- white'>
                                                Withdrawal Fee
                                            </div>
                                            <div className='text- white'>
                                                -$
                                                {(
                                                    amount *
                                                    paymentAgentsSettings
                                                        .withdrawal
                                                        .percentageFee
                                                ).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className='mt-4 flex justify-between border-t border-gray-600 py-2'>
                                            <div className='font-extrabold text-goldAli'>
                                                Withdrawal Total
                                            </div>
                                            <div className='font-extrabold text-goldAli'>
                                                $
                                                {(
                                                    amount -
                                                    amount *
                                                        paymentAgentsSettings
                                                            .withdrawal
                                                            .percentageFee
                                                ).toFixed(2)}
                                            </div>
                                        </div>

                                        {/* Live ZAR Conversion Display */}
                                        <CurrencyComponent
                                            amount={
                                                amount -
                                                amount *
                                                    paymentAgentsSettings
                                                        .withdrawal
                                                        .percentageFee
                                            }
                                        />
                                    </div>

                                    <div className='mt-4 flex flex-col gap-4'>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <div className=''>
                                                <button
                                                    onClick={() => {
                                                        setIsSummary(true)
                                                    }}
                                                    className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Withdraw
                                                </button>
                                            </div>

                                            <div className=''>
                                                <button
                                                    onClick={() => {
                                                        setIsVerificationShown(
                                                            false
                                                        )
                                                        setIsWithdrawalModalOpen(
                                                            false
                                                        )
                                                        setIsSummary(false)
                                                    }}
                                                    className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                                        Verification
                                    </h2>

                                    <div className='mt-4 flex flex-col gap-4'>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Code
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setVerificationCode(value)
                                                }}
                                                value={verificationCode}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Code'
                                            />
                                        </div>

                                        <div className='grid grid-cols-2 gap-2'>
                                            <div className=''>
                                                <button
                                                    onClick={() => {
                                                        sendWithdrawalReq()
                                                    }}
                                                    className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Ok
                                                </button>
                                            </div>

                                            <div className=''>
                                                <button
                                                    onClick={() => {
                                                        setIsVerificationShown(
                                                            false
                                                        )
                                                        setIsWithdrawalModalOpen(
                                                            false
                                                        )
                                                        setIsSummary(false)
                                                    }}
                                                    className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className='mx-auto mt-4 flex w-full max-w-md flex-col gap-3 px-4 text-sm sm:px-6 sm:text-base md:px-8'>
                                {isConfirmShown ? (
                                    <>
                                        <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                                            Withdraw by {selectedPaymentMethod}
                                        </h2>

                                        <CurrencyComponent amount={amount} />
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Amount {accountInfo.currency}
                                            </label>
                                            <input
                                                type='number'
                                                step={0.01}
                                                onChange={e => {
                                                    const value = e.target.value
                                                    setAmount(parseFloat(value))
                                                }}
                                                value={amount}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Amount'
                                            />
                                        </div>

                                        {/* payment method edit */}
                                        <UpdateBankDetails
                                            paymentMethod={
                                                selectedPaymentMethod
                                            }
                                        />

                                        <div className='grid grid-cols-2 gap-2'>
                                            <div className=''>
                                                <button
                                                    onClick={async () => {
                                                        const paymentMethods =
                                                            await getPatmentMethod(
                                                                selectedPaymentMethod
                                                            )

                                                        if (
                                                            paymentMethods.length >
                                                            0
                                                        ) {
                                                            sendEmailVerificationWithdrawalReq()
                                                        } else {
                                                            setIsConfirmShown(
                                                                false
                                                            )
                                                            setIsWithdrawalModalOpen(
                                                                false
                                                            )
                                                            setIsBankModalOpen(
                                                                true
                                                            )
                                                        }
                                                    }}
                                                    className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Withdraw
                                                </button>
                                            </div>

                                            <div className=''>
                                                <button
                                                    onClick={() => {
                                                        setIsConfirmShown(false)

                                                        setIsVerificationShown(
                                                            false
                                                        )
                                                        setIsWithdrawalModalOpen(
                                                            false
                                                        )
                                                        setIsBankModalOpen(
                                                            false
                                                        )
                                                    }}
                                                    className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                                            Choose Withdraw Method
                                        </h2>

                                        {/* <CurrencyComponent
                                            isDeposit={false}
                                            fee={withdrawalFee}
                                            amount={amount}
                                        /> */}
                                        <div className='mb-8 flex w-full flex-col gap-4 overflow-x-hidden'>
                                            {paymentAgentsSettings.withdrawal.methods.map(
                                                method => (
                                                    <div
                                                        key={method.name}
                                                        className='w-full scale-95 text-base sm:scale-100 sm:text-base'
                                                    >
                                                        <button
                                                            className={`w-full rounded-lg px-3 py-3 font-bold text-white transition-colors duration-200 ${
                                                                method.name ===
                                                                'Paypal'
                                                                    ? 'bg-[#003087] hover:bg-[#00236e]'
                                                                    : method.name ===
                                                                        'Crypto_USDT(TRC20)'
                                                                      ? 'bg-[#5c6bc0] hover:bg-[#3f51b5]'
                                                                      : method.name ===
                                                                          'E-Wallet'
                                                                        ? 'bg-[#009688] hover:bg-[#00796b]'
                                                                        : method.name ===
                                                                            'Bank'
                                                                          ? 'bg-[#4caf50] hover:bg-[#388e3c]'
                                                                          : 'bg-goldAli hover:bg-amber-800'
                                                            }`}
                                                            onClick={async () => {
                                                                setSelectedPaymentMethod(
                                                                    method.name
                                                                )

                                                                const paymentMethods =
                                                                    await getPatmentMethod(
                                                                        method.name
                                                                    )

                                                                if (
                                                                    paymentMethods.length >
                                                                    0
                                                                ) {
                                                                    setIsConfirmShown(
                                                                        true
                                                                    )
                                                                } else {
                                                                    setIsConfirmShown(
                                                                        false
                                                                    )
                                                                    setIsWithdrawalModalOpen(
                                                                        false
                                                                    )
                                                                    setIsBankModalOpen(
                                                                        true
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            {method.name}
                                                        </button>

                                                        <div className='mt-1 rounded-xl bg-white px-3 py-2 text-center shadow'>
                                                            <p className='mb-2 text-sm font-bold text-[#1f2633] sm:text-base'>
                                                                Supported
                                                                Methods:
                                                            </p>
                                                            <div className='space-y-2'>
                                                                {method.description.map(
                                                                    (
                                                                        item,
                                                                        i
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className='flex items-center justify-center gap-2 text-[#1f2633]'
                                                                        >
                                                                            <FaCheckCircle
                                                                                className='text-green-500'
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span className='text-sm sm:text-base'>
                                                                                {
                                                                                    item
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className='grid grid-cols-1 gap-2'>
                                            <div className='w-full'>
                                                <button
                                                    onClick={() => {
                                                        setIsConfirmShown(false)
                                                        setIsVerificationShown(
                                                            false
                                                        )
                                                        setIsWithdrawalModalOpen(
                                                            false
                                                        )
                                                    }}
                                                    className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* deposit modal */}

            <Modal
                key={2}
                isClosed={!isDepositModalOpen}
                setIsClosed={setIsDepositModalOpen}
            >
                <div
                    ref={withdrawRef}
                    className='max-h-[70vh] overflow-y-auto rounded-lg bg-[#1A1B25] p-4 text-gray-300'
                >
                    {/* deposit */}

                    {isConfirmShown ? (
                        <>
                            <h2 className='mb-4 text-center text-2xl font-bold uppercase text-goldAli'>
                                Pay with {selectedPaymentMethod}
                            </h2>

                            {/* <CurrencyComponent amount={amount} /> */}

                            {isSummary ? (
                                <>
                                    <div className='flex flex-col gap-1 px-2 py-8'>
                                        <div className='my-2 flex justify-between'>
                                            <div className='text-white'>
                                                Deposit Amount
                                            </div>
                                            <div className='text-white'>
                                                ${amount.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className='my-2 flex justify-between'>
                                            <div className='text-white'>
                                                Deposit Fee
                                            </div>
                                            <div className='text-white'>
                                                -$
                                                {(
                                                    amount *
                                                    paymentAgentsSettings
                                                        .deposit.percentageFee
                                                ).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className='mt-4 flex justify-between border-t border-gray-600 py-2'>
                                            <div className='font-extrabold text-goldAli'>
                                                Total Recieved
                                            </div>
                                            <div className='font-extrabold text-goldAli'>
                                                $
                                                {(
                                                    amount -
                                                    amount *
                                                        paymentAgentsSettings
                                                            .deposit
                                                            .percentageFee
                                                ).toFixed(2)}
                                            </div>
                                        </div>

                                        {/* ✅ Conversion for Total Paid */}
                                        <CurrencyComponent
                                            amount={
                                                amount -
                                                amount *
                                                    paymentAgentsSettings
                                                        .deposit.percentageFee
                                            }
                                        />
                                    </div>

                                    <div className='grid grid-cols-2 gap-2 py-4'>
                                        <div className=''>
                                            {(() => {
                                                if (
                                                    selectedPaymentMethod ==
                                                    'Paypal'
                                                )
                                                    return (
                                                        <PaypalForm
                                                            amount={amount}
                                                            itemId={String(
                                                                Math.random()
                                                            )}
                                                            transactionCode={
                                                                transactionCode.current
                                                            }
                                                        />
                                                    )

                                                if (
                                                    selectedPaymentMethod ===
                                                    'Yoco'
                                                ) {
                                                    return (
                                                        <Yoco
                                                            email={
                                                                accountInfo.email
                                                            }
                                                            loginid={
                                                                accountInfo.loginid
                                                            }
                                                            fullName={
                                                                accountInfo.fullname
                                                            }
                                                            amountPaidInUsd={
                                                                amount
                                                            } // ✅ USD value entered by user
                                                            amountInZar={
                                                                zarAmount
                                                            } // ✅ ZAR converted for Yoco
                                                            transactionCode={
                                                                transactionCode.current
                                                            }
                                                            token={token}
                                                        />
                                                    )
                                                }

                                                const depositMethodKeys =
                                                    Object.keys(paymentMethods)

                                                const depositMethodValues =
                                                    Object.values(
                                                        paymentMethods
                                                    )

                                                const myIndex =
                                                    depositMethodKeys.indexOf(
                                                        selectedPaymentMethod
                                                    )

                                                if (myIndex == -1)
                                                    return (
                                                        <>No Method Available</>
                                                    )

                                                return (
                                                    <Payfast
                                                        email={
                                                            accountInfo.email
                                                        }
                                                        loginId={
                                                            accountInfo.loginid
                                                        }
                                                        fullName={
                                                            accountInfo.fullname
                                                        }
                                                        amountPaidInUsd={
                                                            zarAmount
                                                        }
                                                        transactionCode={
                                                            transactionCode.current
                                                        }
                                                        payment_method={
                                                            depositMethodValues[
                                                                myIndex
                                                            ]
                                                        }
                                                        token={token}
                                                    />
                                                )
                                            })()}
                                        </div>

                                        <div className=''>
                                            <button
                                                onClick={() => {
                                                    setIsSummary(false)
                                                    setIsConfirmShown(false)
                                                    setIsDepositModalOpen(false)
                                                }}
                                                className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='grid grid-cols-2 gap-2 py-0'>
                                    {/* 💱 Conversion Rate Displayed First */}
                                    <div className='col-span-2 mt-2'>
                                        <CurrencyComponent amount={amount} />
                                    </div>

                                    <div className='col-span-2 flex flex-col gap-1'>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Whatsapp Number
                                            </label>
                                            <input
                                                type='text'
                                                onChange={e =>
                                                    setWhatsappNumber(
                                                        e.target.value
                                                    )
                                                }
                                                value={whatsappNumber}
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Whatsapp Number'
                                            />
                                        </div>
                                    </div>

                                    <div className='col-span-2 flex flex-col gap-1'>
                                        <div className='flex flex-col'>
                                            <label className='text-left capitalize'>
                                                Amount {accountInfo.currency}
                                            </label>
                                            <input
                                                type='number'
                                                step={1}
                                                min={12}
                                                onChange={e => {
                                                    const value = e.target.value
                                                    if (value === '') {
                                                        setAmount(NaN)
                                                        return
                                                    }

                                                    const parsed =
                                                        parseFloat(value)
                                                    setAmount(
                                                        isNaN(parsed)
                                                            ? NaN
                                                            : parsed
                                                    )
                                                }}
                                                value={
                                                    isNaN(amount) ? '' : amount
                                                }
                                                className='rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                                                placeholder='Enter Amount (min $12)'
                                            />
                                        </div>
                                    </div>

                                    <div className=''>
                                        <button
                                            onClick={async () => {
                                                if (
                                                    amount < 12 ||
                                                    isNaN(amount)
                                                ) {
                                                    toast.error(
                                                        'Minimum deposit is $12'
                                                    )
                                                    return
                                                }

                                                await depositHandler()
                                            }}
                                            className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                        >
                                            Deposit
                                        </button>
                                    </div>

                                    <div className=''>
                                        <button
                                            onClick={() => {
                                                setIsSummary(false)
                                                setIsConfirmShown(false)
                                                setIsDepositModalOpen(false)
                                            }}
                                            className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className='text-center text-2xl font-bold uppercase text-goldAli'>
                                Select A Method Below:
                            </h2>

                            {/* <CurrencyComponent
                                isDeposit={true}
                                fee={depositFee}
                                amount={amount}
                            /> */}

                            <div className='mt-4 flex flex-col gap-4'>
                                <div className='mb-5 flex w-auto flex-col gap-1 md:w-[40vw]'>
                                    {paymentAgentsSettings.deposit.methods.map(
                                        method => (
                                            <div
                                                key={method.name}
                                                className='w-full scale-90 text-xl sm:scale-100 sm:text-base'
                                            >
                                                <button
                                                    className={`w-full rounded-lg px-2 py-3 font-bold text-white transition-colors duration-200 sm:px-3 sm:py-2 ${
                                                        method.name === 'Paypal'
                                                            ? 'bg-[#003087] hover:bg-[#00236e]' // PayPal
                                                            : method.name ===
                                                                'Yoco'
                                                              ? 'bg-[#40b4f8] hover:bg-[#289ee4]' // Yoco
                                                              : 'bg-goldAli hover:bg-amber-800'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedPaymentMethod(
                                                            method.name
                                                        )
                                                        setIsConfirmShown(true)
                                                    }}
                                                >
                                                    {method.name}
                                                </button>

                                                <div className='mt-1 rounded-xl bg-[#ffffff] px-3 py-2 text-center shadow sm:px-4 sm:py-3'>
                                                    <p className='mb-2 text-base font-bold text-[#1f2633] sm:mb-3 sm:text-lg'>
                                                        Supported Methods:
                                                    </p>
                                                    <div className='space-y-2'>
                                                        {method.description.map(
                                                            (item, i) => (
                                                                <div
                                                                    key={i}
                                                                    className='flex items-center justify-center gap-2 text-[#1f2633]'
                                                                >
                                                                    <FaCheckCircle
                                                                        className='text-green-500'
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                    <span className='text-sm sm:text-base'>
                                                                        {item}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* <div className='flex flex-col gap-1'>
                                    <label className='text-left capitalize'>
                                        Payment Method
                                    </label>
                                    <PaymentMethodsSelector
                                        selectedPaymentMethod={
                                            selectedPaymentMethod
                                        }
                                        setSelectedPaymentMethod={
                                            setSelectedPaymentMethod
                                        }
                                        availablePaymentMethods={
                                            paymentAgentsSettings.deposit
                                                .methods
                                        }
                                    />
                                </div> */}

                                <div className='grid grid-cols-1 gap-2'>
                                    {/* <div className=''>
                                        <button
                                            onClick={async () => {
                                                if (
                                                    amount <
                                                    paymentAgentsSettings
                                                        .deposit.min
                                                ) {
                                                    toast.error(
                                                        `Minimum Deposit is ${paymentAgentsSettings.deposit.min}`
                                                    )
                                                    return
                                                }
                                                setIsConfirmShown(true)

                                                const currentTimeStamp =
                                                    Date.now()

                                                transactionCode.current =
                                                    String(
                                                        `${currentTimeStamp}${accountInfo.loginid}`
                                                    )

                                                await saveDepositData({
                                                    email: accountInfo.email,
                                                    loginId:
                                                        accountInfo.loginid,
                                                    fullName:
                                                        accountInfo.fullname,
                                                    whatsappNumber: 'none',
                                                    amountPaidInUsd: amount,
                                                    agentFeeInUsd: depositFee,
                                                    amountAfterFeeInUsd:
                                                        amount - depositFee,
                                                    transactionCode:
                                                        transactionCode.current,
                                                    paymentMethod:
                                                        selectedPaymentMethod,
                                                    isPaid: false,
                                                })
                                            }}
                                            className='w-full rounded-lg bg-green-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                        >
                                            Deposit
                                        </button>
                                    </div> */}

                                    <div className='w-full'>
                                        <button
                                            onClick={() => {
                                                setIsConfirmShown(false)
                                                setIsDepositModalOpen(false)
                                            }}
                                            className='w-full rounded-lg bg-red-500 px-4 py-3 text-white transition-opacity duration-300 hover:opacity-80'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* bank details */}

            <BankDetails
                paymentMethod={selectedPaymentMethod}
                bankRef={bankRef}
                isBankModalOpen={isBankModalOpen}
                setIsBankModalOpen={setIsBankModalOpen}
                setIsWithdrawalModalOpen={setIsWithdrawalModalOpen}
                setIsConfirmShown={setIsConfirmShown}
            />
        </>
    )
}

const TransactionsCard = ({
    isDeposit,
    amountUSD,
    exchangeRate,
    date,
    isSuccessful,
}: {
    isDeposit: boolean
    amountUSD: number // still the full amount before fees
    exchangeRate: number
    date: Date
    isSuccessful: boolean
}) => {
    const feePercentage = isDeposit
        ? paymentAgentsSettings.deposit.percentageFee
        : paymentAgentsSettings.withdrawal.percentageFee

    const amountAfterFees = amountUSD - amountUSD * feePercentage
    const amountZAR = (amountAfterFees * exchangeRate).toFixed(2)

    return (
        <div className='w-full rounded-xl bg-gray-200 p-6 shadow-lg hover:shadow-xl'>
            <div className='flex items-center justify-between'>
                <div className='text-right'>
                    <h2
                        className={`text-2xl font-semibold ${
                            isDeposit ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {isDeposit ? 'Deposit' : 'Withdrawal'}
                    </h2>
                </div>

                <div
                    className={`rounded-full p-4 ${
                        isDeposit ? 'bg-red-100' : 'bg-green-100'
                    }`}
                >
                    {isDeposit ? (
                        <FaArrowUp size={24} className='text-red-500' />
                    ) : (
                        <FaArrowDown size={24} className='text-green-500' />
                    )}
                </div>
            </div>

            <div className='grid grid-cols-2'>
                <div className='mt-4'>
                    <p className='text-2xl font-bold text-gray-800'>
                        ${amountAfterFees.toFixed(2)} USD
                    </p>
                    <p className='text-lg text-gray-500'>R{amountZAR} ZAR</p>
                </div>

                <div className='flex items-center justify-end'>
                    {isSuccessful ? (
                        <div className='flex gap-1'>
                            <IoMdCheckmarkCircleOutline
                                size={24}
                                className='text-green-500'
                            />{' '}
                            Approved
                        </div>
                    ) : (
                        <div className='flex gap-1'>
                            <RxCrossCircled
                                size={24}
                                className='text-red-500'
                            />{' '}
                            Pending
                        </div>
                    )}
                </div>
            </div>

            <div className='text-goldAli'>
                {new Date(date).toLocaleString('en-ZA', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })}{' '}
                (GMT+2)
            </div>
        </div>
    )
}
