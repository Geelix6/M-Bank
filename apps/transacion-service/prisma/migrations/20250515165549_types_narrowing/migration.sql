/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(21,2)`.
  - Changed the type of `id` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fromUserId` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toUserId` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "fromUserId",
ADD COLUMN     "fromUserId" UUID NOT NULL,
DROP COLUMN "toUserId",
ADD COLUMN     "toUserId" UUID NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(21,2),
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
