import React, { Suspense } from 'react'
import Loader from '@/components/Loader'
import { DerivVerifyEmail } from './DerivVerifyEmail'

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <DerivVerifyEmail />
        </Suspense>
    )
}

export default Page
