import { Prisma } from '@prisma/client'
import { prisma } from '@/modules/db'
import { myPrismaErrorHandler } from '@/modules/prisma-error-handler'
import { subHours } from 'date-fns'

export const cronjob = async () => {
    await expireBots()
}

export async function expireBots() {
    const date30daysAgo = subHours(new Date(), 24 * 30)
    const res = await prisma.botsBought.updateMany({
        where: {
            updatedAt: {
                lt: date30daysAgo,
            },
        },
        data: {
            isValid: false,
        },
    })

    return true
}
