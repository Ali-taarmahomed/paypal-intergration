'use client'
import { Dispatch, SetStateAction } from 'react'

export const PaymentMethodsSelector = ({
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    availablePaymentMethods,
}: {
    selectedPaymentMethod: string
    setSelectedPaymentMethod: Dispatch<SetStateAction<string>>
    availablePaymentMethods: string[]
}) => {
    return (
        <div className='py-2'>
            <select
                className={
                    'w-full rounded-lg border border-goldAli bg-white px-4 py-2 text-black'
                }
                onChange={e => {
                    const paymentMethod = e.currentTarget.value
                    setSelectedPaymentMethod(paymentMethod)
                }}
            >
                {availablePaymentMethods.map(value => {
                    if (value === selectedPaymentMethod) {
                        return (
                            <option
                                selected
                                key={value}
                                defaultValue={value}
                                value={value}
                            >
                                {value}
                            </option>
                        )
                    }
                    return (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

type CartItem = {
    id: number
    name: string
    price: number
    quantity: number
}

interface CheckoutSummaryProps {
    cartItems: CartItem[]
}
