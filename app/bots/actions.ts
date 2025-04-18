'use server'
import { prisma } from '@/modules/db'

// Fetch all bots
export const getbotsAll = async () => {
    const res = await prisma.botsBought.findMany()
    console.log('Fetched All Bots:', res)
    return res
}

// Fetch specific bots based on criteria
export const getbots = async ({
    email,
    loginId,
    isConfirmed,
    isValid,
}: {
    email: string
    loginId: string
    isConfirmed: boolean
    isValid: boolean
}) => {
    const res = await prisma.botsBought.findMany({
        where: { email, isConfirmed, isValid },
    })
    console.log('Fetched Bots:', res)
    console.log('Login ID:', loginId)

    return res
}

// Buy a new bot
export const buyBot = async ({
    email,
    loginId,
    botName,
    amountInUSD,
    confirmationCode,
}: {
    email: string
    loginId: string
    botName: string
    amountInUSD: number
    confirmationCode: string
}) => {
    const myData = {
        email,
        loginId,
        botName,
        amountInUSD,
        confirmationCode,
        isConfirmed: false,
        subscriptionDays: 30,
        isValid: false,
        isDeclined: false, // New flag to indicate declined status
    }

    const resData = await prisma.botsBought.findMany({
        where: {
            email,
            loginId,
            botName,
            isConfirmed: false,
            isDeclined: false,
        }, // Ensure declined bots don't block new submission
    })

    if (resData.length > 0) {
        return {
            isAdded: false,
            reason: 'You have already sent a submission, please wait for an admin to approve.',
        }
    }

    const resData2 = await prisma.botsBought.findMany({
        where: { email, loginId, botName, isConfirmed: true, isValid: true },
    })

    if (resData2.length > 0) {
        return {
            isAdded: false,
            reason: 'You have the bot already, renewal not due yet.',
        }
    }

    const res = await prisma.botsBought.create({ data: myData })
    console.log('Bot Purchased:', res)
    return {
        isAdded: true,
        reason: 'Order Submitted',
    }
}

// Confirm bot purchase
export const confirmBotPurchase = async ({ id }: { id: string }) => {
    const res = await prisma.botsBought.update({
        data: { isConfirmed: true, isValid: true, isDeclined: false },
        where: { id, isConfirmed: false },
    })

    console.log('Bot Approved:', res)

    return { isAdded: true, reason: 'Bot Approved' }
}

// Decline bot purchase
export const declineBotPurchase = async ({ id }: { id: string }) => {
    try {
        const res = await prisma.botsBought.update({
            data: { isConfirmed: false, isValid: false, isDeclined: true }, // Mark the bot as declined
            where: { id, isConfirmed: false }, // Ensure only non-confirmed bots can be declined
        })

        console.log('Bot Declined:', res)

        return { isAdded: true, reason: 'Bot Declined' }
    } catch (error) {
        console.error('Failed to decline bot purchase:', error)
        return { isAdded: false, reason: 'Failed to decline the bot.' }
    }
}

// Revoke bot access (New function)
export const revokeBotAccess = async ({ id }: { id: string }) => {
    try {
        const res = await prisma.botsBought.update({
            data: { isValid: false }, // Set the bot as no longer valid
            where: { id, isConfirmed: true, isValid: true }, // Ensure only confirmed and valid bots can be revoked
        })

        console.log('Bot Access Revoked:', res)

        return { isRevoked: true, reason: 'Bot Access Revoked' }
    } catch (error) {
        console.error('Failed to revoke bot access:', error)
        return { isRevoked: false, reason: 'Failed to revoke the bot access.' }
    }
}
