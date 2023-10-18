/*
  Warnings:

  - You are about to drop the `TokenPrice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TokenPrice" DROP CONSTRAINT "TokenPrice_tokenId_fkey";

-- DropTable
DROP TABLE "TokenPrice";

-- CreateTable
CREATE TABLE "TokenHistory" (
    "id" SERIAL NOT NULL,
    "price" BIGINT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "TokenHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TokenHistory" ADD CONSTRAINT "TokenHistory_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
