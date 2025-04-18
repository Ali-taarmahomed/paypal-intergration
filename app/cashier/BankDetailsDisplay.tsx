'use client'
type BankDetail = {
    paymentMethod: string
    bankName: string
    accountHoldersName: string
    accountNumber: string
    accountType: string
    branchCode: string
    paypalEmail: string
    usdtTrc20Address: string
    eWalletMobile: string
}

type Props = {
    data: BankDetail[]
}

const fieldLabels: Record<keyof BankDetail, string> = {
    paymentMethod: 'Payment Method',
    bankName: 'Bank Name',
    accountHoldersName: "Account Holder's Name",
    accountNumber: 'Account Number',
    accountType: 'Account Type',
    branchCode: 'Branch Code',
    paypalEmail: 'PayPal Email',
    usdtTrc20Address: 'USDT TRC20 Address',
    eWalletMobile: 'eWallet Mobile',
}

const BankDetailsDisplay: React.FC<Props> = ({ data }) => {
    if (data.length === 0) return <p>No bank details available.</p>

    return (
        <div className='space-y-6'>
            {data.map((detail, index) => (
                <div key={index} className='space-y-2 rounded-lg p-4 shadow-sm'>
                    {Object.entries(detail).map(([key, value]) =>
                        value == 'None' ? null : value ? (
                            <div key={key} className='text-sm'>
                                <strong>
                                    {fieldLabels[key as keyof BankDetail]}:
                                </strong>{' '}
                                {value}
                            </div>
                        ) : null
                    )}
                </div>
            ))}
        </div>
    )
}

export default BankDetailsDisplay
