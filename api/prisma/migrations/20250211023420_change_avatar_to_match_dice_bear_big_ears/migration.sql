/*
  Warnings:

  - You are about to drop the column `accessoriesType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `clotheColor` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `clotheType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `eyeType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `eyebrowType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `facialHairColor` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `facialHairType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `graphicType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `mouthType` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `topType` on the `Avatar` table. All the data in the column will be lost.
  - Added the required column `ear` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eyes` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `face` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mouth` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nose` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Made the column `hairColor` on table `Avatar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "accessoriesType",
DROP COLUMN "clotheColor",
DROP COLUMN "clotheType",
DROP COLUMN "eyeType",
DROP COLUMN "eyebrowType",
DROP COLUMN "facialHairColor",
DROP COLUMN "facialHairType",
DROP COLUMN "graphicType",
DROP COLUMN "mouthType",
DROP COLUMN "topType",
ADD COLUMN     "cheek" TEXT,
ADD COLUMN     "ear" TEXT NOT NULL,
ADD COLUMN     "eyes" TEXT NOT NULL,
ADD COLUMN     "face" TEXT NOT NULL,
ADD COLUMN     "frontHair" TEXT,
ADD COLUMN     "hair" TEXT,
ADD COLUMN     "mouth" TEXT NOT NULL,
ADD COLUMN     "nose" TEXT NOT NULL,
ADD COLUMN     "sideburn" TEXT,
ALTER COLUMN "hairColor" SET NOT NULL;
