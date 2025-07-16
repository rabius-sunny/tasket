-- CreateTable
CREATE TABLE "AddRequest" (
    "id" SERIAL NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AddRequest_workspaceId_idx" ON "AddRequest"("workspaceId");

-- CreateIndex
CREATE INDEX "AddRequest_userId_idx" ON "AddRequest"("userId");

-- AddForeignKey
ALTER TABLE "AddRequest" ADD CONSTRAINT "AddRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddRequest" ADD CONSTRAINT "AddRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
