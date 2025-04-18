import React, { Suspense } from 'react'
import { DerivWs } from './DerivWs'
import Loader from '@/components/Loader'

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <DerivWs />
        </Suspense>
    )
}

export default Page
