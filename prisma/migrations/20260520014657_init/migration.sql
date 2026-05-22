-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('ACTIVE', 'DELETED', 'PURGED');

-- CreateTable
CREATE TABLE "Image" (
    "id" UUID NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storedFilename" TEXT NOT NULL,
    "relativePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "checksumSha256" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "altText" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ImageStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_relativePath_key" ON "Image"("relativePath");

-- CreateIndex
CREATE INDEX "Image_status_createdAt_idx" ON "Image"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Image_checksumSha256_idx" ON "Image"("checksumSha256");

-- CreateIndex
CREATE INDEX "Image_deletedAt_idx" ON "Image"("deletedAt");
