'use client'
import { Suspense } from 'react'
import { Cashier } from './Cashier'

export const DerivWs = () => {
    return (
        <Suspense>
            <Cashier />
        </Suspense>
    )
}
