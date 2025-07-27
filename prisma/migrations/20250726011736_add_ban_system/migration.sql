-- CreateTable
CREATE TABLE "Ban" (
    "id" SERIAL NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "reason" TEXT,
    "banned_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ban_ip_hash_key" ON "Ban"("ip_hash");
