/*
  Warnings:

  - A unique constraint covering the columns `[idInAuthService]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_idInAuthService_key" ON "User"("idInAuthService");
