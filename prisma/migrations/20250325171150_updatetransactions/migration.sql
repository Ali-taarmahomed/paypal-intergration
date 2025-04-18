/*
  Warnings:

  - Added the required column `BranchCode` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountHoldersName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountType` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paypalEmail` to the `BankDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Deposits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsappNumber` to the `Deposits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Withdrawals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetails" ADD COLUMN     "BranchCode" TEXT NOT NULL,
ADD COLUMN     "accountHoldersName" TEXT NOT NULL,
ADD COLUMN     "accountType" TEXT NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paypalEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Deposits" ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "whatsappNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Withdrawals" ADD COLUMN     "paymentMethod" TEXT NOT NULL;
