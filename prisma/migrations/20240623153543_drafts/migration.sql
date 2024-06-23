-- CreateTable
CREATE TABLE "Draft" (
    "draftId" TEXT NOT NULL,
    "authorId" TEXT,
    "coverImage" TEXT,
    "title" VARCHAR(255),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("draftId")
);

-- CreateTable
CREATE TABLE "DraftContents" (
    "draftContentId" TEXT NOT NULL,
    "draftId" TEXT,
    "index" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "contentImage" TEXT,

    CONSTRAINT "DraftContents_pkey" PRIMARY KEY ("draftContentId")
);

-- CreateTable
CREATE TABLE "DraftTags" (
    "tagId" TEXT NOT NULL,
    "draftId" TEXT,
    "tag" VARCHAR(50) NOT NULL,

    CONSTRAINT "DraftTags_pkey" PRIMARY KEY ("tagId")
);

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftContents" ADD CONSTRAINT "DraftContents_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("draftId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftTags" ADD CONSTRAINT "DraftTags_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("draftId") ON DELETE SET NULL ON UPDATE CASCADE;
