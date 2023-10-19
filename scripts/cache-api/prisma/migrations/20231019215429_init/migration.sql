-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "price" BIGINT NOT NULL,
    "tokenId" INTEGER NOT NULL,

    CONSTRAINT "TokenHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "assetAId" INTEGER NOT NULL,
    "assetBId" INTEGER NOT NULL,
    "assetShareId" INTEGER NOT NULL,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "pairId" INTEGER NOT NULL,
    "assetAAmount" BIGINT NOT NULL,
    "assetBAmount" BIGINT NOT NULL,
    "assetShareAmount" BIGINT NOT NULL,

    CONSTRAINT "PairHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");

-- AddForeignKey
ALTER TABLE "TokenHistory" ADD CONSTRAINT "TokenHistory_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_assetAId_fkey" FOREIGN KEY ("assetAId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_assetBId_fkey" FOREIGN KEY ("assetBId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_assetShareId_fkey" FOREIGN KEY ("assetShareId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairHistory" ADD CONSTRAINT "PairHistory_pairId_fkey" FOREIGN KEY ("pairId") REFERENCES "Pair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
