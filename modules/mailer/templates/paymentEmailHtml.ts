import { DepositT } from '@/modules/cashier/action'
import { paymentAgentsSettings } from '@/modules/cashier/settings'

export const generatePaymentEmailHtml = (data: DepositT, token: string) => {
    const rootUrl = paymentAgentsSettings.rootUrl

    return `
  <html>
    <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#ffffff;">
      <div style="max-width:620px; margin:30px auto; border-radius:15px; border:4px solid #2c3e50; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.2); background: linear-gradient(135deg, #1A1B25, #2A2C3D);">

        <!-- Header -->
        <div style="background-color:#2A2C3D; padding:20px; text-align:center;">
          <h1 style="margin:0; font-size:26px; color:#f39c12;">DollarTradeClub</h1>
          <span style="color:#ff4444; font-size:14px;">Powered by Deriv</span>
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #ffffff; text-align: center;">

          <h2 style="color:#f39c12; font-size: 22px;">💰 Deposit Successful</h2>

          <div style="margin-top: 20px;">
            ${[
                { label: 'Full Name', value: data.fullName },
                { label: 'Email', value: data.email },
                { label: 'Login ID', value: data.loginId },
                {
                    label: 'Amount (USD)',
                    value: `$${parseFloat(data.amountAfterFeeInUsd.toString()).toFixed(2)}`,
                },
                { label: 'Payment Method', value: data.paymentMethod },
                { label: 'Transaction Code', value: data.transactionCode },
                {
                    label: 'Time',
                    value: new Date(data.createdAt).toLocaleString(),
                },
            ]
                .map(
                    item => `
              <div style="margin: 10px auto; background-color: #2e3243; border-radius: 10px; padding: 14px; border: 1px solid #444;">
                <strong style="color: #f39c12; font-size: 14px;">${item.label}:</strong><br />
                <span style="font-size: 15px; color: #ffffff;">${item.value}</span>
              </div>
            `
                )
                .join('')}
          </div>

          <!-- CR Disclaimer -->
          <div style="margin-top: 30px; background-color:#1f2230; border-radius:12px; padding:15px; color:#f1c40f; border: 1px solid #444;">
            ⚠️ <strong>Please ensure your CR number is correct.</strong><br />
            Payments are non-refundable.<br/><br/>
            ⏳ Deposits may take up to <strong>60 mins</strong> to reflect during <strong>10am–7pm</strong>.<br/>
            Outside of those hours, please allow a few hours.<br/>
            We work hard to process them as fast as possible!
          </div>

          <!-- WhatsApp Button -->
          <div style="margin-top: 25px;">
            <a href="https://wa.me/27847868786" style="display:inline-block; padding:12px 25px; background-color:#25D366; color:#fff; font-weight:bold; border-radius:8px; text-decoration:none;">
              ☎️ WhatsApp Us
            </a>
          </div>

          <!-- Dashboard Button -->
          <div style="margin-top: 20px;">
            <a href="${rootUrl}/cashier?token=${token}" 
              style="display:inline-block; padding:12px 25px; background-color:#f39c12; color:#1A1B25; font-weight:bold; border-radius:8px; text-decoration:none;">
              💳 Go to Your Dashboard
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color:#2A2C3D; color:#ccc; text-align:center; padding:15px; font-size:13px;">
          &copy; ${new Date().getFullYear()} DollarTradeClub. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `
}
