/*
  Warnings:

  - Added the required column `AccountNumber` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eWalletMobile` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "AccountNumber" TEXT NOT NULL,
ADD COLUMN     "eWalletMobile" TEXT NOT NULL;
