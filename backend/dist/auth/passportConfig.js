"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_google_oauth2_1 = require("passport-google-oauth2");
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../../generated/prisma");
const defaultLayout_1 = require("../db/defaultLayout");
dotenv_1.default.config();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const backendUrl = process.env.BACKEND_URL;
const prisma = new prisma_1.PrismaClient();
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: `${backendUrl}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
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
    await (0, defaultLayout_1.createNewUserLayout)(newUser.userId);
    return done(null, newUser);
}));
