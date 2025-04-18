import React, { Suspense } from 'react'
import { AdminLoginForm } from './AdminLoginForm'

const page = () => {
    return (
        <Suspense>
            <AdminLoginForm />
        </Suspense>
    )
}

export default page
