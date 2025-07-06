/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `WeatherComponent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `weatherCompId` on the `WeatherComponent` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `WeatherComponent` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salt]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "WeatherComponent" DROP CONSTRAINT "WeatherComponent_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "userId" SET DATA TYPE SERIAL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "WeatherComponent" DROP CONSTRAINT "WeatherComponent_pkey",
ALTER COLUMN "weatherCompId" SET DATA TYPE INTEGER,
ALTER COLUMN "userId" SET DATA TYPE INTEGER,
ADD CONSTRAINT "WeatherComponent_pkey" PRIMARY KEY ("weatherCompId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_hash_key" ON "User"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "User_salt_key" ON "User"("salt");

-- AddForeignKey
ALTER TABLE "WeatherComponent" ADD CONSTRAINT "WeatherComponent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
