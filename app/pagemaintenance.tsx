'use client'
import { Suspense } from 'react'
import MaintenancePage from '@/components/MaintenancePage'

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MaintenancePage />
        </Suspense>
    )
}

export default Page
