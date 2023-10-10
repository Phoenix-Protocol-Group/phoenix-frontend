/*
  Warnings:

  - Added the required column `timestamp` to the `Pair` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
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
INSERT INTO "new_Pair" ("address", "assetAAmount", "assetAId", "assetBAmount", "assetBId", "assetShareAmount", "assetShareId", "id") SELECT "address", "assetAAmount", "assetAId", "assetBAmount", "assetBId", "assetShareAmount", "assetShareId", "id" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
