/*
  Warnings:

  - Changed the type of `publish_date` on the `Chapter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "publish_date",
ADD COLUMN     "publish_date" TIMESTAMP(3) NOT NULL;
