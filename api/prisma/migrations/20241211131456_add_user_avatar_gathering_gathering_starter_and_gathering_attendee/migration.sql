-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "avatarId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" SERIAL NOT NULL,
    "topType" TEXT NOT NULL,
    "accessoriesType" TEXT NOT NULL,
    "hairColor" TEXT,
    "facialHairType" TEXT NOT NULL,
    "facialHairColor" TEXT,
    "clotheType" TEXT NOT NULL,
    "clotheColor" TEXT,
    "graphicType" TEXT,
    "eyeType" TEXT NOT NULL,
    "eyebrowType" TEXT NOT NULL,
    "mouthType" TEXT NOT NULL,
    "skinColor" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gathering" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "isStartDatetimeStrict" BOOLEAN NOT NULL,
    "endDatetime" TIMESTAMP(3) NOT NULL,
    "isEndDatetimeStrict" BOOLEAN NOT NULL,
    "attendeeMinimum" INTEGER NOT NULL,
    "isAttendeeMinimumStrict" BOOLEAN NOT NULL,
    "attendeeMaximum" INTEGER NOT NULL,
    "isAttendeeMaximumStrict" BOOLEAN NOT NULL,
    "ageMinimum" INTEGER NOT NULL,
    "isAgeMinimumStrict" BOOLEAN NOT NULL,
    "ageMaximum" INTEGER NOT NULL,
    "isAgeMaximumStrict" BOOLEAN NOT NULL,

    CONSTRAINT "Gathering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GatheringStarter" (
    "id" SERIAL NOT NULL,
    "gatheringId" INTEGER NOT NULL,
    "starterId" INTEGER NOT NULL,

    CONSTRAINT "GatheringStarter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GatheringAttendee" (
    "id" SERIAL NOT NULL,
    "gatheringId" INTEGER NOT NULL,
    "attendeeId" INTEGER NOT NULL,

    CONSTRAINT "GatheringAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatheringStarter" ADD CONSTRAINT "GatheringStarter_gatheringId_fkey" FOREIGN KEY ("gatheringId") REFERENCES "Gathering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatheringStarter" ADD CONSTRAINT "GatheringStarter_starterId_fkey" FOREIGN KEY ("starterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatheringAttendee" ADD CONSTRAINT "GatheringAttendee_gatheringId_fkey" FOREIGN KEY ("gatheringId") REFERENCES "Gathering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GatheringAttendee" ADD CONSTRAINT "GatheringAttendee_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
