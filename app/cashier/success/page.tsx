import React, { Suspense } from 'react'
import Loader from '@/components/Loader'
import { PaymentSuccessModal } from './SuccessPage'

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <PaymentSuccessModal />
        </Suspense>
    )
}

export default Page
