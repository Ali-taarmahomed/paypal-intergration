const emailverifyReq = {
    verify_email: 'test@mailinator.com',
    type: 'account_opening',
    url_parameters: {}, //optional
}

const actions = [
    'account_opening',
    'account_verification',
    'reset_password',
    'paymentagent_withdraw',
    'payment_withdraw',
    'trading_platform_dxtrade_password_reset',
    'trading_platform_mt5_password_reset',
    'trading_platform_investor_password_reset',
    'request_email',
    'phone_number_verification',
]

const paymentAgentWithdrawReq = {
    paymentagent_withdraw: 1,
    amount: 1000,
    currency: 'USD',
    paymentagent_loginid: 'CR100001',
    verification_code: 'my_verification_code',
    description: '', //optional
    dry_run: 1, //optional   is for testing
}

const paymentAgentWithdrawRes = {
    echo_req: {
        amount: 10,
        currency: 'USD',
        passthrough: {
            amountInUSD: 10,
            email: 'alitaarmahomed@icloud.com',
            loginid: 'CR7926570',
            paymentMethod: 'Paypal',
            paymentagent_loginid: 'CR5020393',
            signature:
                '$2b$10$PW3lTMxFgLYSsemytw3HReq5PZby4B5MQseCBFA/ZlRIT8gOOyKnG',
        },
        paymentagent_loginid: 'CR5020393',
        paymentagent_withdraw: 1,
        verification_code: 'mwRHVTjL',
    },
    msg_type: 'paymentagent_withdraw',
    passthrough: {
        amountInUSD: 10,
        email: 'alitaarmahomed@icloud.com',
        loginid: 'CR7926570',
        paymentMethod: 'Paypal',
        paymentagent_loginid: 'CR5020393',
        signature:
            '$2b$10$PW3lTMxFgLYSsemytw3HReq5PZby4B5MQseCBFA/ZlRIT8gOOyKnG',
    },
    paymentagent_name: 'DollarTradeClub',
    paymentagent_withdraw: 1,
    transaction_id: 133907308661,
}

//send email verification first before withdrawal

const paymentAgentTransferReq = {
    paymentagent_transfer: 1,
    amount: 1000,
    currency: 'USD',
    transfer_to: 'CR100001',
    description: '', //optional
    dry_run: 1, //optional   is for testing
}

const paymentAgentTransferRes = {
    client_to_full_name: ' Taarmahomed Ali',
    client_to_loginid: 'CR7926570',
    echo_req: {
        amount: '10',
        currency: 'USD',
        paymentagent_transfer: 1,
        transfer_to: 'CR7926570',
    },
    msg_type: 'paymentagent_transfer',
    paymentagent_transfer: 1,
    transaction_id: 133908677361,
}
