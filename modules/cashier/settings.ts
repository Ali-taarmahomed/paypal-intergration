export const paymentAgentsSettings = {
    deposit: {
        min: 12,
        max: 2000,
        percentageFee: 10 / 100,
        methods: [
            {
                name: 'Paypal',
                description: [
                    'Visa & Mastercard',
                    'Bank-linked Payments',
                    'Instant USD Checkout',
                ],
            },
            {
                name: 'Yoco',
                description: [
                    'Visa & Mastercard',
                    'Apple Pay / Google Pay',
                    'Local ZAR Gateway',
                ],
            },
            // 'EFT',
            // 'Credit card',
            // 'Debit card',
            // 'Masterpass Scan to Pay',
            // 'Mobicred',
            // 'SCode',
            // 'SnapScan',
            // 'Zapper',
            // 'MoreTyme',
            // 'Store card',
            // 'Mukuru',
            // 'Apple Pay',
            // 'Samsung Pay',
            // 'Capitec Pay',
        ],
    },
    withdrawal: {
        min: 10,
        max: 2000,
        percentageFee: 10 / 100,
        methods: [
            {
                name: 'Bank',
                description: [
                    'SA Bank Accounts Only',
                    '2-3 Hour Processing',
                    'Available Mon–Fri (10am–6pm)',
                ],
            },
            {
                name: 'Paypal',
                description: [
                    'USD Payouts',
                    'Same-day Processing',
                    'Instant Notification',
                ],
            },
            {
                name: 'E-Wallet',
                description: [
                    'Capitec, FNB, Standard Bank, ABSA',
                    'Send to Phone Number',
                    'Same-Day Processing',
                ],
            },
            {
                name: 'Crypto_USDT(TRC20)',
                description: [
                    'TRC20 Network',
                    'Payout to USDT Address',
                    'Blockchain Fees Apply',
                ],
            },
        ],
    },

    payment_agent_loginId: 'CR5020393',
    adminData: {
        email: 'billionair786254@gmail.com',
        loginId: 'CR5020393',
        password: '12345678',
    },
    rootUrl: 'https://test.dollartradeclub.co.za',
}

export const payFastConfig = {
    testingMode: false,
    merchant_id: '19861437',
    merchant_key: 'hhkggqud1sd9c',
    return_url: `${paymentAgentsSettings.rootUrl}/cashier/success`,
    cancel_url: `${paymentAgentsSettings.rootUrl}/cashier/cancel`,
    notify_url: `${paymentAgentsSettings.rootUrl}/api/payfast/notify`,
    sandbox_url: `https://sandbox.payfast.co.za/eng/process`,
    live_url: `https://www.payfast.co.za/eng/process`,
    signature_secret_key: 'HGY67t7Tkhgyhg',
}

export const payPalConfig = {
    sandbox: true,
    PAYPAL_LIVE_API_URL: 'https://uri.paypal.com',
    PAYPAL_LIVE_CLIENT_ID:
        'AXY_X5V1oaSe1UE4hwJ9zgrvtElzyVgMSX2tNo8-lYCCC2BckGxC1XlpNXT7ms2Kv7aqCahZH_V3h0de',
    PAYPAL_LIVE_SECRET:
        'EJ4xgBPfTFNqJ_P9fzmVlr1co2XCM2ZDkl3hY3iRMUy-EirEHfrlrw0sk6gfHm_MJFumB_PqOxzBiyFW',
    PAYPAL_SANDBOX_API_URL: 'https://api.sandbox.paypal.com',
    PAYPAL_SANDBOX_CLIENT_ID:
        'AWqRZFMGcLn_OADJfjPaN8rHwmAhZ4wYykngRCAk2BoTk7UItdoRLzQ1X1uKkG_z0_9st6n6_RwrwTjF',
    PAYPAL_SANDBOX_SECRET:
        'EFAj9ozYx60H28TnzXcuQMsOtk1eJHHbLZgj4zNBO52JHucGCE_KLPhz3pc7limzda_zunhQ2PX3BFQ9',
    return_url: `${paymentAgentsSettings.rootUrl}/cashier/success`,
    cancel_url: `${paymentAgentsSettings.rootUrl}/cashier/cancel`,
    notify_url: `${paymentAgentsSettings.rootUrl}/api/paypal/notify`,
}
