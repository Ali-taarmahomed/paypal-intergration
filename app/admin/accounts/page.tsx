'use client'

import React, { Suspense, useEffect } from 'react'
import { useDerivAccount } from '@/hooks/useDerivAccount'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/state/store'
import { saveAccounts } from '@/state/userAccounts/userAccountsSlice'
import { Loading } from '@/components/Loading'
import { useGetQueryParams } from '@/hooks/useGetQueryParams'
import { useDerivWs } from '@/hooks/useDerivWs'

const Page = () => {
    return (
        <Suspense fallback={<Loading />}>
            <DerivAccounts />
        </Suspense>
    )
}

const DerivAccounts = () => {
    const { signature } = useGetQueryParams()

    const myDerivAccounts = useDerivAccount()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(saveAccounts(myDerivAccounts))
    }, [myDerivAccounts, dispatch])

    const { isReady } = useDerivWs({
        token: myDerivAccounts[0].token,
    })

    useEffect(() => {
        if (isReady) {
            window.location.href = `/admin/dashboard?token=${myDerivAccounts[0].token}&signature=${signature}`
        }
        return () => {}
    }, [isReady])

    if (myDerivAccounts[0]?.token === '') {
        return <Loading />
    }

    return <Loading />
}

export default Page
