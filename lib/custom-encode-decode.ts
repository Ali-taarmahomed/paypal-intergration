export const encodeData = (data: any, expiresInSeconds: number): string => {
    const payload = {
        data,
        exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    }
    return Buffer.from(JSON.stringify(payload)).toString('base64')
}

export const decodeData = (token: string): any | null => {
    try {
        const decoded = JSON.parse(
            Buffer.from(token, 'base64').toString('utf-8')
        )
        if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return null
        }
        return decoded.data
    } catch (error) {
        return null
    }
}
