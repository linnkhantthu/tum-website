-- CreateTable
CREATE TABLE "AdminGroup" (
    "id" TEXT NOT NULL,
    "nrcNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGroup" (
    "id" TEXT NOT NULL,
    "nrcNo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminGroup_nrcNo_key" ON "AdminGroup"("nrcNo");

-- CreateIndex
CREATE UNIQUE INDEX "AdminGroup_email_key" ON "AdminGroup"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentGroup_nrcNo_key" ON "StudentGroup"("nrcNo");

-- CreateIndex
CREATE UNIQUE INDEX "StudentGroup_email_key" ON "StudentGroup"("email");
