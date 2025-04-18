'use client'
import { DerivAccountsState } from '@/state/userAccounts/userAccountsSlice'
import { useGetQueryParams } from './useGetQueryParams'

export const useDerivAccount = (): DerivAccountsState[] => {
    const derivAccounts = useGetQueryParams()
    const myDerivAccounts = []

    const derivAccountsTotal = Object.keys(derivAccounts).length / 3

    for (let i = 1; i <= derivAccountsTotal; i++) {
        myDerivAccounts.push({
            code: String(derivAccounts['acct' + i]),
            token: String(derivAccounts['token' + i]),
            isLive: i === derivAccountsTotal ? false : true,
            currency: String(derivAccounts['cur' + i]),
        })
    }

    return myDerivAccounts
}
