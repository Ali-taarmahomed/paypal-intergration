import React, { Suspense } from 'react'
import Loader from '@/components/Loader'
import { UpdateWithdrawal } from './UpdateWithdrawal'

const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <UpdateWithdrawal />
        </Suspense>
    )
}

export default page
