import { payPalConfig } from '@/modules/cashier/settings'

export const getAccessToken = async () => {
    let PAYPAL_API_URL = payPalConfig.PAYPAL_LIVE_API_URL
    let PAYPAL_CLIENT_ID = payPalConfig.PAYPAL_LIVE_CLIENT_ID
    let PAYPAL_SECRET = payPalConfig.PAYPAL_LIVE_SECRET

    if (payPalConfig.sandbox) {
        PAYPAL_API_URL = payPalConfig.PAYPAL_SANDBOX_API_URL
        PAYPAL_CLIENT_ID = payPalConfig.PAYPAL_SANDBOX_CLIENT_ID
        PAYPAL_SECRET = payPalConfig.PAYPAL_SANDBOX_SECRET
    }
    const basicAuth = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
    ).toString('base64')

    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    const data = await response.json()
    return data.access_token
}
