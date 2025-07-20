import { PrismaClient, RefreshToken } from "../../generated/prisma";

const prisma = new PrismaClient();

const main = async () => {

};

main()
    .catch((e) => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
