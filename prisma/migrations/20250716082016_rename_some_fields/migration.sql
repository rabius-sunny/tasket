/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `ChecklistItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChecklistItem" DROP CONSTRAINT "ChecklistItem_assignedTo_fkey";

-- DropIndex
DROP INDEX "ChecklistItem_assignedTo_idx";

-- AlterTable
ALTER TABLE "ChecklistItem" DROP COLUMN "assignedTo",
ADD COLUMN     "assigneeId" INTEGER;

-- CreateIndex
CREATE INDEX "ChecklistItem_assigneeId_idx" ON "ChecklistItem"("assigneeId");

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
