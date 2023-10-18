/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Pair` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pair" DROP COLUMN "timestamp";

-- CreateTable
CREATE TABLE "TokenPrice" (
    "id" SERIAL NOT NULL,
    "price" BIGINT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "TokenPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairHistory" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "pairId" INTEGER NOT NULL,

    CONSTRAINT "PairHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenPrice" ADD CONSTRAINT "TokenPrice_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairHistory" ADD CONSTRAINT "PairHistory_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
