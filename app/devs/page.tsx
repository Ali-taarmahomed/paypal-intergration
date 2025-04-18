import { Suspense } from 'react'
import { DerivWs } from './DerivWs'
import { CustomToast } from '@/components/CustomToast'

const page = () => {
    return (
        <Suspense>
            <DerivWs />
            <CustomToast />
        </Suspense>
    )
}

export default page
