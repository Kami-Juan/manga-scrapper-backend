-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(250) NOT NULL,
    "title" VARCHAR(250) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(250) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "visibilily" BOOLEAN NOT NULL DEFAULT false,
    "followers" DECIMAL(19,0) NOT NULL,
    "image_url" VARCHAR(250),
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(250) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "score" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "booktype" VARCHAR(250) NOT NULL,
    "demography" VARCHAR(250) NOT NULL,
    "image_url" VARCHAR(250),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(250) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ListToManga" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "List.user_id_unique" ON "List"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ListToManga_AB_unique" ON "_ListToManga"("A", "B");

-- CreateIndex
CREATE INDEX "_ListToManga_B_index" ON "_ListToManga"("B");

-- AddForeignKey
ALTER TABLE "List" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToManga" ADD FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToManga" ADD FOREIGN KEY ("B") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
