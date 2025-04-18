/*
  Warnings:

  - Added the required column `isDeclined` to the `BotsBought` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BotsBought" ADD COLUMN     "isDeclined" BOOLEAN NOT NULL;
