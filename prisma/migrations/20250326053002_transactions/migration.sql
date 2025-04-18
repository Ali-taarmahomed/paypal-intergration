/*
  Warnings:

  - Added the required column `usdtTrc20Address` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "usdtTrc20Address" TEXT NOT NULL;
