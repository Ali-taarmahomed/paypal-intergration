/*
  Warnings:

  - You are about to drop the column `AccountNumber` on the `BankDetails` table. All the data in the column will be lost.
  - You are about to drop the column `BranchCode` on the `BankDetails` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchCode` to the `BankDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" DROP COLUMN "AccountNumber",
DROP COLUMN "BranchCode",
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "branchCode" TEXT NOT NULL;
