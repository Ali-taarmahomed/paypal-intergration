'use client'
import { Suspense } from 'react'
import ComingSoon from './ComingSoon'

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ComingSoon />
        </Suspense>
    )
}

export default Page
