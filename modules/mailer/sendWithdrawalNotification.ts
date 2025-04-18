import nodemailer from 'nodemailer'
import { generateWithdrawalEmailHtml } from '@/modules/mailer/templates/withdrawalEmailHtml'
import { WithdrawalT } from '@/modules/cashier/action'

type EmailProps = {
    withdrawal: WithdrawalT
    token: string
}

export const sendWithdrawalEmail = async ({
    withdrawal,
    token,
}: EmailProps) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dollartradeclubpayments@gmail.com',
            pass: 'vgckkpwfmtwjkvjq',
        },
    })

    const html = generateWithdrawalEmailHtml(withdrawal, token)

    const mailOptionsCustomer = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to: withdrawal.email,
        subject: '📤 Withdrawal Confirmation – We Got It!',
        html,
    }

    const mailOptionsAdmin = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to: 'dollartradeclubpayments@gmail.com',
        subject: '📤 New Withdrawal Request – Admin Copy',
        html,
    }

    try {
        await transporter.sendMail(mailOptionsCustomer)
        console.log(`📬 Withdrawal email sent to customer: ${withdrawal.email}`)

        await transporter.sendMail(mailOptionsAdmin)
        console.log(`📬 Withdrawal email sent to admin`)
    } catch (error) {
        console.error('❌ Error sending withdrawal email:', error)
    }
}
