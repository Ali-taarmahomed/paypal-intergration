import React, { Suspense } from 'react'
import { AdminDashboard } from './Dashboard'
import { Loader } from 'lucide-react'

const page = () => {
    return (
        <Suspense fallback={<Loader />}>
            <AdminDashboard />
        </Suspense>
    )
}

export default page
