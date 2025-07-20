"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const main = async () => {
};
main()
    .catch((e) => {
    console.error(e.message);
})
    .finally(async () => {
    await prisma.$disconnect();
});
