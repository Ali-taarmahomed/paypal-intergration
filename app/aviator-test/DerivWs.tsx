'use client'
import { Suspense } from 'react'
import { Aviator } from './Aviator'

export const DerivWs = () => {
    return (
        <Suspense>
            <Aviator />
        </Suspense>
    )
}
