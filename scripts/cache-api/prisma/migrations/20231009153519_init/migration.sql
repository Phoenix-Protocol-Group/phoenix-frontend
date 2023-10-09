/*
  Warnings:

  - You are about to drop the column `assetAddressA` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `assetAddressB` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `assetAdressShare` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Pair` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Token` table. All the data in the column will be lost.
  - Added the required column `assetAId` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetBId` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetShareId` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PairToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    CONSTRAINT "PairToken_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "assetAId" INTEGER NOT NULL,
    "assetBId" INTEGER NOT NULL,
    "assetShareId" INTEGER NOT NULL,
    CONSTRAINT "Pair_assetAId_fkey" FOREIGN KEY ("assetAId") REFERENCES "PairToken" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_assetBId_fkey" FOREIGN KEY ("assetBId") REFERENCES "PairToken" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_assetShareId_fkey" FOREIGN KEY ("assetShareId") REFERENCES "PairToken" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("address", "id") SELECT "address", "id" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL
);
INSERT INTO "new_Token" ("address", "id") SELECT "address", "id" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
