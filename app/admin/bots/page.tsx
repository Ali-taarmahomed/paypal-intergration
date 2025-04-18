'use client'
import { Suspense } from 'react'
import { Bots } from './Bots'

const page = () => {
    return (
        <Suspense>
            <Bots />
        </Suspense>
    )
}

export default page
