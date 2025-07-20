"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_js_1 = require("./auth/authentication.js");
const validation_js_1 = require("./validator/validation.js");
// SECRET KEY
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frontend = process.env.FRONTEND_URL;
const cors_1 = __importDefault(require("cors"));
const corsOption = {
    origin: [frontend],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_js_1 = require("./../generated/prisma/index.js");
const passwordUtils_js_1 = require("./lib/passwordUtils.js");
const authServer_js_1 = require("./authServer/authServer.js");
const authErrorHandler_js_1 = require("./authServer/authErrorHandler.js");
const prisma = new index_js_1.PrismaClient();
// !not ideal, store in a db
let refreshTokenArr = [];
// *middleware config
const app = (0, express_1.default)();
// cors for connecting to vite
app.use((0, cors_1.default)(corsOption));
// const PgSession = connectPgSimple(session);
app.use(authErrorHandler_js_1.errorHandler);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// *routes
// authenticate the user to access weather
app.use("/auth", authServer_js_1.authRoute);
app.get("/", authentication_js_1.authenticateToken, (req, res) => {
    res.json({ email: req.body.email });
});
app.get("/componentInLayouts", passwordUtils_js_1.verifyAccessToken, async (req, res) => {
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
        const layouts = layoutSizes.map((layout) => {
            const key = layout.layoutSize;
            const values = layout.WeatherComponents.map((v) => v.dataGrid);
            return { [key]: values };
        });
        return Object.assign({}, ...layouts);
    };
    const dataGrid = await tryFetchLayout(decoded.userId);
    res.status(200).json(dataGrid);
    return;
});
app.put("/componentInLayouts", validation_js_1.layoutValidator, passwordUtils_js_1.verifyAccessToken, async (req, res) => {
    const decoded = req.decoded;
    const layouts = req.body.layouts;
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
        }
        catch (e) {
            console.error(e);
        }
        res.status(202).json({ message: "layout saved successfully" });
        return;
    }
});
app.delete("/componentInLayouts", validation_js_1.layoutValidator, passwordUtils_js_1.verifyAccessToken, async (req, res) => {
    const decoded = req.decoded;
    const { id, breakpoint } = req.body;
    if (!id || !breakpoint || !decoded) {
        res.status(400).send({ message: "id or breakpoint not found" });
        return;
    }
    // data: [lg: [{dataGrid}, {dataGrid:2}], md:]
    // remove
    try {
        await prisma.$transaction(async (tx) => {
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
    }
    catch (e) {
        console.error(e);
    }
    res.send(202);
});
app.post("/componentInLayouts", passwordUtils_js_1.verifyAccessToken, async (req, res) => {
    const { newComp, breakpoint } = req.body;
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
    const layoutJson = JSON.parse(JSON.stringify(newComp));
    try {
        await prisma.weatherComponent.create({
            data: {
                layoutSize: breakpoint,
                userId: Number(userId),
                weatherId: newComp.i,
                dataGrid: layoutJson,
            },
        });
    }
    catch (e) {
        console.error(e);
    }
    res.status(201).json({ message: "Component created successfully" });
    return;
});
app.listen(3000, () => {
    console.log("server on port 3000 started");
});
