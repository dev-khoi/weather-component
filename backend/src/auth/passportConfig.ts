import passport, { Profile } from "passport";
import { VerifyCallback } from "passport-google-oauth2";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import { PrismaClient } from "../../generated/prisma";
import { createNewUserLayout } from "../db/defaultLayout";
dotenv.config();
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const backendUrl = process.env.BACKEND_URL!;
const prisma = new PrismaClient();

passport.use(
  new OAuth2Strategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `${backendUrl}/auth/google/callback`,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
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
    }
  )
);
export { passport };
