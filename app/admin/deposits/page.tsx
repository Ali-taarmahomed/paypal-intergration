import React, { Suspense } from 'react'
import { Deposits } from './Deposits'
import Loader from '@/components/Loader'

const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Deposits />
        </Suspense>
    )
}

export default page
