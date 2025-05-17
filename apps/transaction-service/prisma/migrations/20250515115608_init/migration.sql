-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('GIFT', 'TRANSACTION');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
