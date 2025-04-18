import { payFastConfig } from '@/modules/cashier/settings'
import crypto from 'crypto'

const SECRET_KEY = payFastConfig.signature_secret_key

export const generateSignature = (data: Record<string, any>): string => {
    let pfOutput = ''
    for (const key of Object.keys(data).sort()) {
        if (data[key] !== '') {
            pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`
        }
    }

    // Append the passphrase (if required)
    const dataString = pfOutput.slice(0, -1) + `&passphrase=${SECRET_KEY}`

    // Generate MD5 hash
    return crypto.createHash('md5').update(dataString).digest('hex')
}

export const verifySignature = (
    data: Record<string, any>,
    receivedSignature: string
): boolean => {
    const sortedData = Object.keys(data)
        .filter(key => key !== 'signature') // Exclude existing signature
        .sort()
        .map(key => `${key}=${encodeURIComponent(data[key])}`)
        .join('&')

    const dataString = sortedData + `&passphrase=${SECRET_KEY}`

    // Generate expected signature
    const expectedSignature = crypto
        .createHash('md5')
        .update(dataString)
        .digest('hex')

    return expectedSignature === receivedSignature
}
