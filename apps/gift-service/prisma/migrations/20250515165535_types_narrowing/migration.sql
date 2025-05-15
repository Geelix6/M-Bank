/*
  Warnings:

  - The primary key for the `Gift` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `userId` on the `Gift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "Gift_pkey" PRIMARY KEY ("userId");
