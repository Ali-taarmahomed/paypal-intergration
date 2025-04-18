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
        subject: '💸 Withdrawal Request Received – DollarTradeClub',
        html,
    }

    const mailOptionsAdmin = {
        from: '"DollarTradeClub" <dollartradeclubpayments@gmail.com>',
        to: 'dollartradeclubpayments@gmail.com',
        subject: '🧾 New Withdrawal Submitted – Admin Copy',
        html,
    }

    // Debug log before sending
    console.log(`📤 Attempting to send to customer: ${withdrawal.email}`)

    try {
        const customerRes = await transporter.sendMail(mailOptionsCustomer)
        console.log(`📧 Customer mail sent. ID: ${customerRes.messageId}`)
    } catch (err) {
        console.error('❌ Failed to send customer withdrawal email:', err)
    }

    try {
        const adminRes = await transporter.sendMail(mailOptionsAdmin)
        console.log(`📧 Admin mail sent. ID: ${adminRes.messageId}`)
    } catch (err) {
        console.error('❌ Failed to send admin withdrawal email:', err)
    }
}
