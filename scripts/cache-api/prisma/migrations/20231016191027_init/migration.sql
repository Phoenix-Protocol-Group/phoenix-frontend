/*
  Warnings:

  - You are about to drop the column `timestamp` on the `PairHistory` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `PairHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `TokenHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PairHistory" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "TokenHistory" ADD COLUMN     "createdAt" BIGINT NOT NULL;
