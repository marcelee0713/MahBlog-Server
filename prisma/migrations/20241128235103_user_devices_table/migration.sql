-- CreateTable
CREATE TABLE "UserDevices" (
    "deviceId" TEXT NOT NULL,
    "userId" TEXT,
    "lastSignedIn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserDevices_pkey" PRIMARY KEY ("deviceId")
);

-- CreateTable
CREATE TABLE "DeviceVerifications" (
    "deviceVerificationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expectedDeviceId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceVerifications_pkey" PRIMARY KEY ("deviceVerificationId")
);

-- AddForeignKey
ALTER TABLE "UserDevices" ADD CONSTRAINT "UserDevices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
