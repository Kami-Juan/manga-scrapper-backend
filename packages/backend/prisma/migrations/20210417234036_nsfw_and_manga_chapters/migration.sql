/*
  Warnings:

  - Added the required column `manga_id` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "viewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manga_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "nfsw" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Chapter" ADD FOREIGN KEY ("manga_id") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
