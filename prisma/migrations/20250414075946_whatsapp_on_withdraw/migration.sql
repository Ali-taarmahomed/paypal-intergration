/*
  Warnings:

  - Added the required column `whatsappNumber` to the `Withdrawals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Withdrawals" ADD COLUMN     "whatsappNumber" TEXT NOT NULL;
