"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUserLayout = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const colWidth = 2;
const gridCols = 12;
const tileHeight = 3;
const createBaseLayout = () => {
    const itemsPerRow = gridCols / colWidth; // 6 items per row
    const layoutItems = Array.from({ length: 19 }, (_, id) => {
        const x = (id % itemsPerRow) * colWidth;
        const y = Math.floor(id / itemsPerRow) * tileHeight;
        return {
            i: id.toString(),
            x,
            y,
            w: colWidth,
            h: tileHeight,
            minW: colWidth,
            minH: tileHeight,
            maxW: 5,
            maxH: 6,
            static: false,
        };
    });
    return layoutItems;
    // return {
    //   lg: layoutItems,
    //   md: layoutItems,
    //   sm: layoutItems,
    //   xs: layoutItems,
    //   xxs: layoutItems,
    // };
};
// const createLayout = (id: string) => {
//   return {
//     i: id,
//     x: 0,
//     y: 0,
//     w: colWidth,
//     h: tileHeight,
//     minW: colWidth,
//     minH: tileHeight,
//     maxW: 5,
//     maxH: 6,
//     static: false,
//   };
// };
const createNewUserLayout = async (userId) => {
    const layoutSizes = ["lg", "md", "sm", "xs", "xxs"];
    const layoutCreates = prisma.weatherLayout.createMany({
        data: layoutSizes.map((size) => ({
            userId,
            layoutSize: size,
        })),
        skipDuplicates: true,
    });
    // Prepare component creation promises for each layout size
    const componentCreates = layoutSizes.map((size) => {
        const baseLayouts = createBaseLayout(); // this must be synchronous
        return prisma.weatherComponent.createMany({
            data: baseLayouts.map((e) => ({
                userId,
                dataGrid: e,
                layoutSize: size,
                weatherId: String(e.i),
            })),
            skipDuplicates: true,
        });
    });
    await prisma.$transaction([
        layoutCreates,
        ...componentCreates
    ]);
};
exports.createNewUserLayout = createNewUserLayout;
