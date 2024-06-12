/*
  Warnings:

  - Made the column `bestScore` on table `Device` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "bestScore" SET NOT NULL,
ALTER COLUMN "bestScore" SET DEFAULT 0;
