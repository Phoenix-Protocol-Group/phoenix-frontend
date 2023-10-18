/*
  Warnings:

  - You are about to drop the column `isSharedToken` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `decimals` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "isSharedToken",
ADD COLUMN     "decimals" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");
