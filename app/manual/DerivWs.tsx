'use client'
import { Suspense } from 'react'
import { ManualTrading } from './ManualTrading'

export const DerivWs = () => {
    return (
        <Suspense>
            <ManualTrading />
        </Suspense>
    )
}
