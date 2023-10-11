-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "assetAId" INTEGER NOT NULL,
    "assetAAmount" BIGINT NOT NULL,
    "assetBId" INTEGER NOT NULL,
    "assetBAmount" BIGINT NOT NULL,
    "assetShareId" INTEGER NOT NULL,
    "assetShareAmount" BIGINT NOT NULL,
    CONSTRAINT "Pair_assetAId_fkey" FOREIGN KEY ("assetAId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_assetBId_fkey" FOREIGN KEY ("assetBId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pair_assetShareId_fkey" FOREIGN KEY ("assetShareId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
