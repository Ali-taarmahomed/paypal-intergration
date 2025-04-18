'use client'
import { Suspense } from 'react'
import { PickedBot } from './PickedBot'

const page = () => {
    return (
        <div>
            <Suspense>
                <PickedBot />
            </Suspense>
        </div>
    )
}

export default page
