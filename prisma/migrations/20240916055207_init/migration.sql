-- CreateTable
CREATE TABLE "BotsBought" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "loginId" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "subscriptionDays" INTEGER NOT NULL,
    "isValid" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotsBought_pkey" PRIMARY KEY ("id")
);
