/*
  Warnings:

  - Added the required column `active` to the `AppPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AppPermission" ADD COLUMN     "active" BOOLEAN NOT NULL;
