-- CreateTable
CREATE TABLE "ConstructionSite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConstructionSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- Default construction site
INSERT INTO "ConstructionSite" ("id", "name", "address", "createdAt", "updatedAt")
VALUES ('default-site', 'Демо-объект', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Migrate unique executors to employees
INSERT INTO "Employee" ("id", "fullName", "position", "isActive", "createdAt", "updatedAt")
SELECT
    'emp-' || md5("executorName"),
    "executorName",
    'рабочий',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "executorName" FROM "JournalEntry") AS names;

-- WorkType: add new columns
ALTER TABLE "WorkType" ADD COLUMN "code" TEXT;
ALTER TABLE "WorkType" ADD COLUMN "defaultUnit" TEXT;
ALTER TABLE "WorkType" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "WorkType" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "WorkType"
SET "code" = upper(regexp_replace(left("name", 20), '[^a-zA-Zа-яА-Я0-9]', '_', 'g')) || '_' || left("id", 6)
WHERE "code" IS NULL;

ALTER TABLE "WorkType" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "WorkType_code_key" ON "WorkType"("code");

-- JournalEntry: add FK columns
ALTER TABLE "JournalEntry" ADD COLUMN "constructionSiteId" TEXT;
ALTER TABLE "JournalEntry" ADD COLUMN "employeeId" TEXT;

UPDATE "JournalEntry"
SET "constructionSiteId" = 'default-site',
    "employeeId" = 'emp-' || md5("executorName");

ALTER TABLE "JournalEntry" ALTER COLUMN "constructionSiteId" SET NOT NULL;
ALTER TABLE "JournalEntry" ALTER COLUMN "employeeId" SET NOT NULL;

ALTER TABLE "JournalEntry" DROP COLUMN "executorName";

-- Drop old index, add new
DROP INDEX IF EXISTS "JournalEntry_workDate_idx";
CREATE INDEX "JournalEntry_constructionSiteId_workDate_idx" ON "JournalEntry"("constructionSiteId", "workDate");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_constructionSiteId_fkey" FOREIGN KEY ("constructionSiteId") REFERENCES "ConstructionSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
