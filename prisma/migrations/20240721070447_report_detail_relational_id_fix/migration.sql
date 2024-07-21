-- DropForeignKey
ALTER TABLE "ReportDetails" DROP CONSTRAINT "ReportDetails_reportDetailId_fkey";

-- AddForeignKey
ALTER TABLE "ReportDetails" ADD CONSTRAINT "ReportDetails_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "UserReports"("reportId") ON DELETE RESTRICT ON UPDATE CASCADE;
