-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pair" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "assetAId" INTEGER NOT NULL,
    "assetAAmount" BIGINT NOT NULL,
    "assetBId" INTEGER NOT NULL,
    "assetBAmount" BIGINT NOT NULL,
    "assetShareId" INTEGER NOT NULL,
    "assetShareAmount" BIGINT NOT NULL,

    CONSTRAINT "Pair_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_assetAId_fkey" FOREIGN KEY ("assetAId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_assetBId_fkey" FOREIGN KEY ("assetBId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pair" ADD CONSTRAINT "Pair_assetShareId_fkey" FOREIGN KEY ("assetShareId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
