/*
  Warnings:

  - You are about to alter the column `timestamp` on the `Pair` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
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
INSERT INTO "new_Pair" ("address", "assetAAmount", "assetAId", "assetBAmount", "assetBId", "assetShareAmount", "assetShareId", "id", "timestamp") SELECT "address", "assetAAmount", "assetAId", "assetBAmount", "assetBId", "assetShareAmount", "assetShareId", "id", "timestamp" FROM "Pair";
DROP TABLE "Pair";
ALTER TABLE "new_Pair" RENAME TO "Pair";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
