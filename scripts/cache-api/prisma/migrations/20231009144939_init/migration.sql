-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "assetAddressA" TEXT NOT NULL,
    "assetAddressB" TEXT NOT NULL,
    "assetAdressShare" TEXT NOT NULL
);
