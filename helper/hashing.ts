import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10 //

export const hashData = async (data: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    return bcrypt.hash(data, salt)
}

export const verifyHash = async (
    data: string,
    hash: string
): Promise<boolean> => {
    return bcrypt.compare(data, hash)
}
