import React, { Suspense } from 'react'
import Loader from '@/components/Loader'
import { PaymentCancelledModal } from './CancelPage'

const Page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <PaymentCancelledModal />
        </Suspense>
    )
}

export default Page
