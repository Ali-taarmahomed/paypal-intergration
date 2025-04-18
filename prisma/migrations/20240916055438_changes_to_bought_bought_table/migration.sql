/*
  Warnings:

  - You are about to drop the column `amount` on the `BotsBought` table. All the data in the column will be lost.
  - Added the required column `amountInUSD` to the `BotsBought` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isConfirmed` to the `BotsBought` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BotsBought" DROP COLUMN "amount",
ADD COLUMN     "amountInUSD" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL;
