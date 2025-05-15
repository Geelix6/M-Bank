/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `balance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(21,2)`.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(21,2),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
