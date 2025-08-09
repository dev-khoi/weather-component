-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" VARCHAR(14) NOT NULL DEFAULT 'user',
    "email" VARCHAR(254) NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "providerId" TEXT,
    "hash" VARCHAR(64),
    "salt" VARCHAR(64),
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "WeatherLayout" (
    "userId" INTEGER NOT NULL,
    "layoutSize" VARCHAR(14) NOT NULL,

    CONSTRAINT "WeatherLayout_pkey" PRIMARY KEY ("layoutSize","userId")
);

-- CreateTable
CREATE TABLE "WeatherComponent" (
    "layoutSize" VARCHAR(14) NOT NULL,
    "userId" INTEGER NOT NULL,
    "weatherId" TEXT NOT NULL,
    "dataGrid" JSONB NOT NULL,

    CONSTRAINT "WeatherComponent_pkey" PRIMARY KEY ("layoutSize","userId","weatherId")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_hash_key" ON "User"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "User_salt_key" ON "User"("salt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "WeatherLayout" ADD CONSTRAINT "WeatherLayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherComponent" ADD CONSTRAINT "WeatherComponent_layoutSize_userId_fkey" FOREIGN KEY ("layoutSize", "userId") REFERENCES "WeatherLayout"("layoutSize", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
