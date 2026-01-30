/*
  Warnings:

  - A unique constraint covering the columns `[startTime]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endTime]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Availability_startTime_key" ON "Availability"("startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_endTime_key" ON "Availability"("endTime");
