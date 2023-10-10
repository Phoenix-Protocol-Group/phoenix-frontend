/*
  Warnings:

  - You are about to drop the `PairToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assetAAmount` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetBAmount` to the `Pair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetShareAmount` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PairToken";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "assetAId" INTEGER NOT NULL,
    "assetAAmount" INTEGER NOT NULL,
    "assetBId" INTEGER NOT NULL,
    "assetBAmount" INTEGER NOT NULL,
    "assetShareId" INTEGER NOT NULL,
    "assetShareAmount" INTEGER NOT NULL,
    CONSTRAINT "Pair_assetAId_fkey" FOREIGN KEY ("assetAId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_assetBId_fkey" FOREIGN KEY ("assetBId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_assetShareId_fkey" FOREIGN KEY ("assetShareId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pair" ("address", "assetAId", "assetBId", "assetShareId", "id") SELECT "address", "assetAId", "assetBId", "assetShareId", "id" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
