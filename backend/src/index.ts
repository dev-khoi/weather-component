import express from "express";

import { authenticateToken } from "./auth/authentication.js";
import { layoutValidator } from "./validator/validation.js";
// SECRET KEY
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "./auth/authentication.js";
import { PrismaClient } from "./../generated/prisma/index.js";
import { verifyAccessToken } from "./lib/passwordUtils.js";
import { error } from "console";
import { createBaseLayout, createLayout } from "./db/defaultLayout.js";
import { InputJsonValue } from "@prisma/client/runtime/library.js";
import { authRoute } from "./authServer.js";
const prisma = new PrismaClient();

// !not ideal, store in a db
let refreshTokenArr = [];

// *middleware config
const app = express();
// cors for connecting to vite
app.use(cors(corsOption));
// const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// *routes
// authenticate the user to access weather

app.use("/auth", authRoute)


app.get("/", authenticateToken, (req, res) => {
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

  const tryFetchLayout = async (userId) => {
    const layoutSizes = await prisma.weatherLayout.findMany({
      where: {
        userId: userId,
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
    const layouts = layoutSizes.map((layout) => {
      const key = layout.layoutSize;
      const values = layout.WeatherComponents.map((v) => v.dataGrid);
      return { [key]: values };
    });
    return Object.assign({}, ...layouts);
  };

  const userId = Number(decoded.userId);
  const dataGrid = await tryFetchLayout(userId);
  res.status(200).json(dataGrid);
  return;
});

app.put(
  "/componentInLayouts",
  layoutValidator,
  verifyAccessToken,
  async (req, res) => {
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
      // UPDATING THE LAYOUTS
      try {
        await prisma.$transaction(async (tx) => {
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
  async (req, res) => {
    const decoded = req.decoded;
    const { id, breakpoint } = req.body;

    if (!id || !breakpoint) {
      res.status(400).send({ message: "id or breakpoint not found" });
    }
    // data: [lg: [{dataGrid}, {dataGrid:2}], md:]
    // remove
    try {
      await prisma.$transaction(async (tx) => {
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

app.post("/componentInLayouts", verifyAccessToken, async (req, res) => {
  const { newComp, breakpoint }: { newComp: Layout; breakpoint: string } =
    req.body;
  console.log(newComp, breakpoint);
  const userId = req.decoded.userId;

  if (!newComp || !breakpoint || !userId) {
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
});

app.listen(3000, () => {
  console.log("server on port 3000 started");
});
