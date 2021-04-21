/*
  Warnings:

  - Added the required column `fansub_title` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fansub_url` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish_date` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "fansub_title" VARCHAR(250) NOT NULL,
ADD COLUMN     "fansub_url" VARCHAR(250) NOT NULL,
ADD COLUMN     "publish_date" VARCHAR(250) NOT NULL;
