import { Suspense } from 'react'
import { Landing } from './Landing'
import Loader from '@/components/Loader'

export default function Page() {
    return (
        <Suspense fallback={<Loader />}>
            <Landing />
        </Suspense>
    )
}
