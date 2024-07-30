-- DropForeignKey
ALTER TABLE "ReportDetails" DROP CONSTRAINT "ReportDetails_reportId_fkey";

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "UserReports"("reportId") ON DELETE CASCADE ON UPDATE CASCADE;
