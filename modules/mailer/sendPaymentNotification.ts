// File: modules/mailer/sendPaymentNotification.ts

import nodemailer from 'nodemailer'
import { generatePaymentEmailHtml } from './templates/paymentEmailHtml'
import { generateWithdrawalEmailHtml } from './templates/withdrawalEmailHtml'
import { DepositT, WithdrawalT } from '@/modules/cashier/action'

// ✅ SEND DEPOSIT EMAIL
type DepositEmailOptions = {
    subject: string
    data: DepositT
    token: string
    to: string
}

export const sendPaymentEmail = async ({
    subject,
    data,
    token,
    to,
}: DepositEmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dollartradeclubpayments@gmail.com',
            pass: 'vgckkpwfmtwjkvjq',
        },
    })

    const html = generatePaymentEmailHtml(data, token)

    const mailOptions = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to,
        subject,
        html,
    }

    try {
        const result = await transporter.sendMail(mailOptions)
        console.log(`📧 Deposit email sent to ${to}:`, result.messageId)
    } catch (err) {
        console.error(`❌ Failed to send deposit email to ${to}:`, err)
    }
}

// ✅ SEND WITHDRAWAL EMAIL
type WithdrawalEmailOptions = {
    withdrawal: WithdrawalT
    token: string
}

export const sendWithdrawalEmail = async ({
    withdrawal,
    token,
}: WithdrawalEmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dollartradeclubpayments@gmail.com',
            pass: 'vgckkpwfmtwjkvjq',
        },
    })

    const html = generateWithdrawalEmailHtml(withdrawal, token)

    const mailOptionsToClient = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to: withdrawal.email,
        subject: '💸 Withdrawal Request Received – DollarTradeClub',
        html,
    }

    const mailOptionsToAdmin = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to: 'dollartradeclubpayments@gmail.com',
        subject: '🧾 New Withdrawal Submitted – Admin Copy',
        html,
    }

    try {
        const clientMail = await transporter.sendMail(mailOptionsToClient)
        const adminMail = await transporter.sendMail(mailOptionsToAdmin)

        console.log(`📤 Withdrawal email sent to client: ${withdrawal.email}`)
        console.log(`📤 Withdrawal email sent to admin.`)
    } catch (err) {
        console.error('❌ Withdrawal email sending error:', err)
    }
}
