/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");
