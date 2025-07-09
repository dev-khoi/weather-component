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
import { PrismaClient } from "./generated/prisma/index.js";
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

app.get("/", authenticateToken, (req, res) => {
  res.json({ email: req.body.email });
});

app.get("/layout", async (req, res) => {
  // extracting the token
  const accessToken = req.cookies.accessToken;
  // if invalid accessToken
  // send to verifyingToken
  if (accessToken == null) {
    res.sendStatus(401);
    console.log("tampered cookie")
    return;
  }

  // hand
  const tryFetchLayout = async (userId) => {
    const layout = await prisma.weatherLayout.findUnique({
      where: {
        weatherCompId_userId: {
          weatherCompId: 0,
          userId: userId,
        },
      },
      select: {
        dataGrid: true,
      },
    });
    return layout;
  };

  // verifying access token
  // prettier-ignore
  jwt.verify(accessToken,process.env.ACCESS_SECRET_TOKEN,async (err, decoded) => {
      if(!err){
        const userId = BigInt(decoded.userId)
        const dataGrid = await tryFetchLayout(userId);
        res
            .status(200)
            .json(dataGrid);
            console.log("working")
         return ;
      }
       res.status(401).json({ message: "unauthorized" });

    }
  );
  return;
});

app.put("/savingLayout", layoutValidator, (req, res) => {
  const accessToken = req.cookies.accessToken;
  // if invalid accessToken
  // send to verifyingToken
  if (accessToken == null) {
    res.sendStatus(401);
    return;
  }
  // prettier-ignore
  jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "unauthorized" });
      }
      const layouts = req.body.layouts;

      await prisma.weatherLayout.update({
        where: {
          weatherCompId_userId:{weatherCompId:0, 
            userId: decoded.userId}
        } ,
        data: {
          dataGrid: layouts
        }
  
      });
      console.log("save successfully")
      res.send(202)
    }
  );
});

app.listen(3000, () => {
  console.log("server on port 3000 started");
});
