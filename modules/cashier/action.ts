'use server'
import { prisma } from '@/modules/db'
import { paymentAgentsSettings } from './settings'
import { verifyHash } from '@/helper/hashing'
import { AccountTypeT } from '@/app/cashier/BankDetails'
import { encodeData } from '@/lib/custom-encode-decode'
import axios from 'axios'
import { sendPaymentEmail } from '@/modules/mailer/sendPaymentNotification'

export type DepositT = {
    id: string
    email: string
    loginId: string
    fullName: string
    whatsappNumber: string
    amountPaidInUsd: number
    agentFeeInUsd: number
    amountAfterFeeInUsd: number
    transactionCode: string
    paymentMethod: string
    isPaid: boolean
    isConfirmedByAdmin: boolean
    createdAt: Date
    updatedAt: Date
}

export type WithdrawalT = {
    id: string
    email: string
    loginId: string
    fullName: string
    whatsappNumber: String
    amountWithdrawnInUsd: number // Using number since Decimal is usually stored as a number
    agentFeeInUsd: number
    amountAfterFeeInUsd: number
    paymentMethod: string
    transactionCode: string
    isConfirmedByAdmin: boolean
    createdAt: Date
    updatedAt: Date
    bankDetailsId: string
}

export type BankDetailsT = {
    id: string
    email: string
    loginId: string
    fullName: string
    whatsappNumber: string
    paymentMethod: string
    bankName: string
    accountHoldersName: string
    accountNumber: string
    accountType: string
    branchCode: string
    paypalEmail: string
    usdtTrc20Address: string
    eWalletMobile: string
    createdAt: Date
    updatedAt: Date
}

export type AdminTransactionSummary = {
    deposits: {
        initial: number
        fee: number
        final: number
    }
    withdrawals: {
        initial: number
        fee: number
        final: number
    }
    totalFees: number
}

export type UserTransactionT = {
    amount: number
    date: Date
    isDeposit: boolean
    isSuccessful: boolean
}

//bank details

export const getBankDetails = async ({
    email,
    loginId,
    paymentMethod,
}: {
    email: string
    loginId: string
    paymentMethod: string
}) => {
    const myPaymentMethods = await prisma.bankDetails.findMany({
        where: { loginId: loginId, email: email, paymentMethod: paymentMethod },
    })
    return myPaymentMethods
}

export const saveBankDetails = async ({
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
}: {
    email: string
    loginId: string
    fullName: string
    whatsappNumber: string
    paymentMethod: string
    bankName: string
    accountHoldersName: string
    accountNumber: string
    accountType: AccountTypeT
    branchCode: string
    paypalEmail: string
    usdtTrc20Address: string
    eWalletMobile: string
}) => {
    const res = await prisma.bankDetails.create({
        data: {
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
        },
    })
}

export const updateBankDetails = async ({
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
}: {
    email: string
    loginId: string
    fullName: string
    whatsappNumber: string
    paymentMethod: string
    bankName: string
    accountHoldersName: string
    accountNumber: string
    accountType: AccountTypeT
    branchCode: string
    paypalEmail: string
    usdtTrc20Address: string
    eWalletMobile: string
}) => {
    const res = await prisma.bankDetails.updateMany({
        data: {
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
        },
        where: {
            email,
            loginId,
            paymentMethod,
        },
    })
}

// withdrawal
export const withdraw = async ({
    whatsappNumber,
    email,
    loginId,
    amountInUSD,
    paymentMethod,
    signature,
}: {
    whatsappNumber: string
    email: string
    loginId: string
    amountInUSD: number
    paymentMethod: string
    signature: string
}) => {
    const dataToVerify = { email, loginId, amountInUSD, paymentMethod }

    const isValid = await verifyHash(JSON.stringify(dataToVerify), signature)

    if (!isValid) return { status: 'failed', message: 'Invalid Data' }

    const currentBank = await prisma.bankDetails.findMany({
        where: { loginId: loginId, email: email, paymentMethod: paymentMethod },
    })

    if (currentBank.length == 0) {
        return { status: 'failed', message: '' }
    }

    const data = currentBank[0]

    const agentFeeInUsd =
        amountInUSD * paymentAgentsSettings.withdrawal.percentageFee

    const myData = {
        email: data.email,
        loginId: data.loginId,
        fullName: data.fullName,
        whatsappNumber: whatsappNumber,
        amountWithdrawnInUsd: amountInUSD,
        agentFeeInUsd: agentFeeInUsd,
        amountAfterFeeInUsd: amountInUSD - agentFeeInUsd,
        paymentMethod: paymentMethod,
        transactionCode: 'none',
        isConfirmedByAdmin: false,
        bankDetailsId: data.id,
    }

    const res = await prisma.withdrawals.create({ data: myData })

    return {
        status: 'success',
        message: 'Your Withdrawal is being processed please wait',
    }
}

export const adminGetWithdrawals = async ({
    isConfirmedByAdmin,
}: {
    isConfirmedByAdmin: boolean
}) => {
    const withdrawals = await prisma.withdrawals.findMany({
        where: { isConfirmedByAdmin: isConfirmedByAdmin },
    })
    return withdrawals
}

export const adminGetBankDetails = async ({
    bankDetailsId,
}: {
    bankDetailsId: string
}) => {
    const paymentMethod = await prisma.bankDetails.findMany({
        where: { id: bankDetailsId },
    })
    return paymentMethod
}

export const adminApproveWithdrawals = async ({
    withdrawalId,
    transactionCode,
}: {
    withdrawalId: string
    transactionCode: string
}) => {
    await prisma.withdrawals.update({
        data: { transactionCode, isConfirmedByAdmin: true },
        where: { id: withdrawalId },
    })
}

export const adminDeleteWithdrawals = async ({
    withdrawalId,
}: {
    withdrawalId: string
}) => {
    await prisma.withdrawals.delete({ where: { id: withdrawalId } })
}

//deposit

export const updatePaypalTransactionDeposit = async ({
    transactionCode,
    paypalTransactionCode,
}: {
    transactionCode: string
    paypalTransactionCode: string
}) => {
    console.log(transactionCode, paypalTransactionCode)
    await prisma.deposits.updateMany({
        data: { transactionCode: paypalTransactionCode },
        where: { transactionCode: transactionCode, paymentMethod: 'Paypal' },
    })
}

export const saveDepositData = async ({
    email,
    loginId,
    fullName,
    whatsappNumber,
    amountPaidInUsd,
    agentFeeInUsd,
    amountAfterFeeInUsd,
    transactionCode,
    paymentMethod,
    isPaid,
}: {
    email: string
    loginId: string
    fullName: string
    whatsappNumber: string
    amountPaidInUsd: number
    agentFeeInUsd: number
    amountAfterFeeInUsd: number
    transactionCode: string
    paymentMethod: string
    isPaid: boolean
}) => {
    const myData = {
        email,
        loginId,
        fullName,
        whatsappNumber,
        amountPaidInUsd,
        agentFeeInUsd,
        amountAfterFeeInUsd,
        transactionCode,
        paymentMethod,
        isPaid,
        isConfirmedByAdmin: false,
    }

    console.table(myData)

    try {
        const res = await prisma.deposits.create({ data: myData })
        console.log('worked')
    } catch (error) {
        console.error(error)
    }
}

export const adminGetDeposits = async ({
    isConfirmedByAdmin,
}: {
    isConfirmedByAdmin: boolean
}) => {
    const deposits = await prisma.deposits.findMany({
        where: { isConfirmedByAdmin: isConfirmedByAdmin, isPaid: true },
    })
    return deposits
}

export const adminApproveDeposits = async ({
    depositId,
}: {
    depositId: string
}) => {
    console.log(depositId)
    await prisma.deposits.update({
        data: { isConfirmedByAdmin: true },
        where: { id: depositId },
    })
}

export const updateDeposits = async ({
    transactionCode,
}: {
    transactionCode: string
}) => {
    const existing = await prisma.deposits.findFirst({
        where: { transactionCode },
    })

    if (!existing || existing.isPaid) return

    await prisma.deposits.update({
        where: { id: existing.id },
        data: { isPaid: true },
    })

    console.log('📬 Sending admin email...')

    await sendPaymentEmail({
        subject: '🎉 Deposit Received – Admin Copy',
        token: '', // No dashboard button for admin
        to: 'dollartradeclubpayments@gmail.com',
        data: {
            id: existing.id,
            email: existing.email,
            loginId: existing.loginId,
            fullName: existing.fullName,
            whatsappNumber: existing.whatsappNumber,
            amountPaidInUsd: Number(existing.amountPaidInUsd),
            agentFeeInUsd: Number(existing.agentFeeInUsd),
            amountAfterFeeInUsd: Number(existing.amountAfterFeeInUsd),
            transactionCode: existing.transactionCode,
            paymentMethod: existing.paymentMethod,
            isPaid: true,
            isConfirmedByAdmin: existing.isConfirmedByAdmin,
            createdAt: existing.createdAt,
            updatedAt: new Date(),
        },
    })
}

export const adminDeleteDeposits = async ({
    depositId,
}: {
    depositId: string
}) => {
    await prisma.deposits.delete({ where: { id: depositId } })
}

//admin

const SESSION_LIMIT = 60 * 60 * 24 //expires in 24 hour

export const adminLogin = async ({
    email,
    loginId,
    password,
}: {
    email: string
    loginId: string
    password: string
}) => {
    const adminData = paymentAgentsSettings.adminData
    const signature = encodeData(
        {
            email: email.toLocaleLowerCase(),
            loginId: loginId.toLocaleLowerCase(),
        },
        SESSION_LIMIT
    )

    if (
        email.toLocaleLowerCase() == adminData.email.toLocaleLowerCase() &&
        loginId.toLocaleLowerCase() == adminData.loginId.toLocaleLowerCase()
    ) {
        if (password == adminData.password)
            return { status: 'success', message: 'Login', signature }

        return { status: 'failed', message: 'Wrong Password', signature: '' }
    } else {
        return {
            status: 'failed',
            message: 'Account Not Available',
            signature: '',
        }
    }
}

const roundToDecimalPlaces = (value: number, dp: number) => {
    const decimalPlaces = 10 ** dp
    return Math.floor(value * decimalPlaces) / decimalPlaces
}

//admin summary

export const adminTransactionSummary = async () => {
    const depositsRes = await prisma.deposits.findMany({
        where: { isPaid: true, isConfirmedByAdmin: true },
    })

    const depositBeforeFees = roundToDecimalPlaces(
        depositsRes
            .map(value => parseFloat(String(value.amountPaidInUsd)))
            .reduce((acc, curr) => acc + curr, 0),
        2
    )
    const depositFees = roundToDecimalPlaces(
        depositsRes
            .map(value => parseFloat(String(value.agentFeeInUsd)))
            .reduce((acc, curr) => acc + curr, 0),
        2
    )
    const depositAfterFees = roundToDecimalPlaces(
        depositsRes
            .map(value => parseFloat(String(value.amountAfterFeeInUsd)))
            .reduce((acc, curr) => acc + curr, 0),
        2
    )

    const withdrawalsRes = await prisma.withdrawals.findMany({
        where: { isConfirmedByAdmin: true },
    })

    const withdrawalBeforeFees = roundToDecimalPlaces(
        withdrawalsRes
            .map(value => parseFloat(String(value.amountWithdrawnInUsd)))
            .reduce((acc, curr) => acc + curr, 0),
        2
    )
    const withdrawalFees = roundToDecimalPlaces(
        withdrawalsRes
            .map(value => parseFloat(String(value.agentFeeInUsd)))
            .reduce((acc, curr) => acc + curr, 0),
        2
    )
    const withdrawalAfterFees = roundToDecimalPlaces(
        withdrawalsRes
            .map(value => parseFloat(String(value.amountAfterFeeInUsd)))
            .reduce((acc, curr) => acc + curr, 0),
        2
    )

    return {
        deposits: {
            initial: depositBeforeFees,
            fee: depositFees,
            final: depositAfterFees,
        },
        withdrawals: {
            initial: withdrawalBeforeFees,
            fee: withdrawalFees,
            final: withdrawalAfterFees,
        },
        totalFees: depositFees + withdrawalFees,
    }
}

export const getUserTransaction = async ({ loginId }: { loginId: string }) => {
    const deposits = (
        await prisma.deposits.findMany({
            where: { loginId, isPaid: true },
        })
    ).map(value => {
        return {
            amount: parseFloat(String(value.amountPaidInUsd)),
            date: new Date(value.createdAt),
            isDeposit: true,
            isSuccessful: value.isConfirmedByAdmin,
        }
    })
    const withdrawal = (
        await prisma.withdrawals.findMany({
            where: { loginId },
        })
    ).map(value => {
        return {
            amount: parseFloat(String(value.amountWithdrawnInUsd)),
            date: new Date(value.createdAt),
            isDeposit: false,
            isSuccessful: value.isConfirmedByAdmin,
        }
    })

    const transactions = [...deposits, ...withdrawal].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return transactions
}

// export const createAdmin = async ({
//     email,
//     loginId,
//     password,
// }: {
//     email: string
//     loginId: string
//     password: string
// }) => {
//     const hashedpassword = password
//     const myData = { email, loginId, password: hashedpassword }
//     await prisma.admins.create({ data: myData })
// }

// export const loginAdmin = async ({
//     email,
//     password,
// }: {
//     email: string
//     password: string
// }) => {
//     const res = await prisma.admins.findMany({ where: { email } })
//     if (res.length == 0) return { status: 'failed', message: '' }

//     const myData = res[0]

//     if (myData.password == password) return { status: 'success', message: '' }
//     return { status: 'failed', message: 'Wrong Password' }
// }

export const createYocoCheckout = async ({
    email,
    loginId,
    fullName,
    amountPaidInUsd,
    amountInZar,
    transactionCode,
    token,
}: {
    email: string
    loginId: string
    fullName: string
    amountPaidInUsd: number
    amountInZar: number
    transactionCode: string
    token: string
}) => {
    const secretKey = process.env.YOCO_SECRET_KEY
    const yocoApiUrl = 'https://payments.yoco.com/api/checkouts'
    const zarAmountInCents = Math.round(amountInZar * 100)

    try {
        const response = await axios.post(
            yocoApiUrl,
            {
                amount: zarAmountInCents,
                currency: 'ZAR',
                successUrl: `${paymentAgentsSettings.rootUrl}/cashier/success?token=${token}`,
                cancelUrl: `${paymentAgentsSettings.rootUrl}/cashier?status=cancelled&token=${token}`,
                callbackUrl: `${paymentAgentsSettings.rootUrl}/api/yoco/yoco`,

                metadata: {
                    email,
                    loginId,
                    fullName,
                    transactionCode,
                    usdAmount: amountPaidInUsd,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${secretKey}`,
                },
            }
        )

        return response.data
    } catch (error: any) {
        console.error('❌ Yoco Error:', error?.response?.data || error.message)
        return null
    }
}
