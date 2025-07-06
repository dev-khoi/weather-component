-- CreateTable
CREATE TABLE "User" (
    "userId" BIGSERIAL NOT NULL,
    "username" VARCHAR(14) NOT NULL DEFAULT 'user',
    "email" VARCHAR(254) NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "salt" VARCHAR(64) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "WeatherComponent" (
    "weatherCompId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "dataGrid" JSONB NOT NULL,

    CONSTRAINT "WeatherComponent_pkey" PRIMARY KEY ("weatherCompId","userId")
);

-- AddForeignKey
ALTER TABLE "WeatherComponent" ADD CONSTRAINT "WeatherComponent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
