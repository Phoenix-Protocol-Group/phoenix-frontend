/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Pair` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pair_address_key" ON "Pair"("address");
