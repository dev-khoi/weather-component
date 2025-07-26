import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
// import { createNewUserLayout } from "../db/defaultLayout";
dotenv.config();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const backendUrl = process.env.BACKEND_URL;
const prisma = new PrismaClient();
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
    await prisma.$transaction([layoutCreates, ...componentCreates]);
};
passport.use(new OAuth2Strategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: `${backendUrl}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    console.log("if there is user goping to passport");
    const existingUser = await prisma.user.findUnique({
        where: {
            providerId: profile.id, // assumes profile.id is unique to this provider
        },
    });
    // If user exists, return it
    if (existingUser) {
        return done(null, existingUser);
    }
    const email = profile.emails?.[0]?.value;
    if (!email) {
        return done(new Error("No email returned by provider"), null);
    }
    // Otherwise, create new user
    const newUser = await prisma.user.create({
        data: {
            username: profile.displayName || "user",
            email,
            provider: "google",
            providerId: profile.id,
            // no hash/salt for OAuth users
        },
    });
    await createNewUserLayout(newUser.userId);
    return done(null, newUser);
}));
export { passport };
