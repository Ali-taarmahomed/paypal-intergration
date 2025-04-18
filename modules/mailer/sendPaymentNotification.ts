// File: modules/mailer/sendPaymentNotification.ts

import nodemailer from 'nodemailer'
import { generatePaymentEmailHtml } from '@/modules/mailer/templates/paymentEmailHtml'
import { DepositT } from '@/modules/cashier/action'

type EmailOptions = {
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
}: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dollartradeclubpayments@gmail.com',
            pass: 'vgckkpwfmtwjkvjq', // Gmail App Password
        },
    })

    const html = generatePaymentEmailHtml(data, token) // ⬅️ no `type` passed

    const mailOptions = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to,
        subject,
        html,
    }

    try {
        const result = await transporter.sendMail(mailOptions)
        console.log(`📧 Email sent to ${to}:`, result.messageId)
    } catch (err) {
        console.error(`❌ Failed to send email to ${to}:`, err)
    }
}
