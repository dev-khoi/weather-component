import express, { Request, Response } from "express";
import { Layout } from "./types/type.js";
import { authenticateToken } from "./auth/authentication.js";
import { layoutValidator } from "./validator/validation.js";
// SECRET KEY
import dotenv from "dotenv";
dotenv.config();
const frontend = process.env.FRONTEND_URL!;

import cors from "cors";
const corsOption = {
  origin: [frontend],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
import cookieParser from "cookie-parser";
import { PrismaClient } from "./../generated/prisma/index.js";
import { verifyAccessToken } from "./lib/passwordUtils.js";
import { InputJsonValue } from "@prisma/client/runtime/library.js";
import { authRoute } from "./authServer/authServer.js";
import { errorHandler } from "./authServer/authErrorHandler.js";
const prisma = new PrismaClient();

// !not ideal, store in a db
let refreshTokenArr = [];

// *middleware config
const app = express();
// cors for connecting to vite
// const PgSession = connectPgSimple(session);
app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));

// *routes
// authenticate the user to access weather

app.use("/auth", authRoute);

app.get("/", authenticateToken, (req: Request, res: Response) => {
  res.json({ email: req.body.email });
});

app.get("/componentInLayouts", verifyAccessToken, async (req, res) => {
  // extracting the token
  const decoded = req.decoded;

  // if invalid accessToken
  // send to verifyingToken
  if (!decoded) {
    res.sendStatus(401);
    return;
  }

  const tryFetchLayout = async (userId: string) => {
    const layoutSizes = await prisma.weatherLayout.findMany({
      where: {
        userId: Number(userId),
      },
      select: {
        layoutSize: true,
        WeatherComponents: {
          select: {
            dataGrid: true,
          },
        },
      },
    });
    const layouts = layoutSizes.map((layout : any) => {
      const key = layout.layoutSize;
      const values = layout.WeatherComponents.map((v : any) => v.dataGrid);
      return { [key]: values };
    });
    return Object.assign({}, ...layouts);
  };

  const dataGrid = await tryFetchLayout(decoded.userId);
  res.status(200).json(dataGrid);
  return;
});

app.put(
  "/componentInLayouts",
  layoutValidator,
  verifyAccessToken,
  async (req: Request, res: Response) => {
    const decoded = req.decoded;
    const layouts: { string: Layout[] } = req.body.layouts;

    if (!decoded || !layouts) {
      res.status(400).send({ message: "not working" });
      return;
    }

    // data: [lg: [{dataGrid}, {dataGrid:2}], md:]
    // remove & update the changes
    const layoutsArr = Object.entries(layouts);
    for (const [layoutSize, layoutComps] of layoutsArr) {
      if (layoutComps.length < 1) {
        throw new Error("cannot have 0 layoutComps");
      }
      // UPDATING THE LAYOUTS
      try {
        await prisma.$transaction(async (tx : any) => {
          // update
          for (const comp of layoutComps) {
            const update = await prisma.weatherComponent.updateMany({
              where: {
                layoutSize: layoutSize,
                userId: Number(decoded.userId),
                weatherId: comp.i,
              },
              data: {
                dataGrid: { ...comp },
              },
            });
            console.debug({ update });
          }
        });
      } catch (e) {
        console.error(e);
      }
      res.status(202).json({ message: "layout saved successfully" });
      return;
    }
  }
);

app.delete(
  "/componentInLayouts",
  layoutValidator,
  verifyAccessToken,
  async (req: Request, res: Response) => {
    const decoded = req.decoded;
    const { id, breakpoint } = req.body;

    if (!id || !breakpoint || !decoded) {
      res.status(400).send({ message: "id or breakpoint not found" });
      return;
    }
    // data: [lg: [{dataGrid}, {dataGrid:2}], md:]
    // remove
    try {
      await prisma.$transaction(async (tx : any) => {
        const matchingComponents = await prisma.weatherComponent.findMany({
          where: {
            userId: Number(decoded.userId),
            layoutSize: breakpoint,
          },
        });

        if (matchingComponents.length <= 1) {
          throw new Error("Cannot delete the last remaining layout component.");
        }
        // delete
        const remove = await prisma.weatherComponent.delete({
          where: {
            layoutSize_userId_weatherId: {
              userId: Number(decoded.userId),
              layoutSize: breakpoint,
              weatherId: id,
            },
          },
        });
      });
    } catch (e) {
      console.error(e);
    }

    res.send(202);
  }
);

app.post(
  "/componentInLayouts",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    const { newComp, breakpoint }: { newComp: Layout; breakpoint: string } =
      req.body;
    console.log(newComp, breakpoint);

    if (!req.decoded || !newComp || !breakpoint) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const userId = req.decoded.userId;

    if (!userId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const layoutJson: InputJsonValue = JSON.parse(JSON.stringify(newComp));
    try {
      await prisma.weatherComponent.create({
        data: {
          layoutSize: breakpoint,
          userId: Number(userId),
          weatherId: newComp.i,
          dataGrid: layoutJson,
        },
      });
    } catch (e) {
      console.error(e);
    }
    res.status(201).json({ message: "Component created successfully" });
    return;
  }
);

app.listen(3000, () => {
  console.log("server on port 3000 started");
});
