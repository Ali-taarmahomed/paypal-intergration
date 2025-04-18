import { decodeData } from '@/lib/custom-encode-decode'

type DataT = { email: string; loginId: string }

export const isValidLogin = (data: DataT, token: string) => {
    const decodedData = decodeData(token)

    console.log(token)

    const newData = {
        email: data.email.toLocaleLowerCase(),
        loginId: data.loginId.toLocaleLowerCase(),
    }

    if (decodedData == null) return false

    console.log(newData, decodedData)

    return JSON.stringify(newData) === JSON.stringify(decodedData)
        ? true
        : false
}
