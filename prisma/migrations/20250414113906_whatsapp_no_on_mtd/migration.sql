/*
  Warnings:

  - Added the required column `whatsappNumber` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "whatsappNumber" TEXT NOT NULL;
