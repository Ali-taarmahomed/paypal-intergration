import React, { Suspense } from 'react'
import { Withdrawal } from './Withdrawal'
import Loader from '@/components/Loader'

const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Withdrawal />
        </Suspense>
    )
}

export default page
