/*
  Warnings:

  - You are about to drop the column `appId` on the `AppPermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appName]` on the table `AppPermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appName` to the `AppPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AppPermission" DROP COLUMN "appId",
ADD COLUMN     "appName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppPermission_appName_key" ON "public"."AppPermission"("appName");
