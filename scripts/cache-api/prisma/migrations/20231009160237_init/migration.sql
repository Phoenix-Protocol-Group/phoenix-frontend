/*
  Warnings:

  - You are about to drop the column `address` on the `PairToken` table. All the data in the column will be lost.
  - Added the required column `tokenId` to the `PairToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PairToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    CONSTRAINT "PairToken_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PairToken" ("amount", "id") SELECT "amount", "id" FROM "PairToken";
DROP TABLE "PairToken";
ALTER TABLE "new_PairToken" RENAME TO "PairToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
