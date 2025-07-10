/*
  Warnings:

  - Added the required column `admin` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "admin" INTEGER NOT NULL;
