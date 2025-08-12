import express from "express";

import { layoutValidator } from "@/validator/validation.js";

import {
  deleteComponentsInLayouts,
  getComponentsInLayouts,
  postComponentsInLayouts,
  putComponentsInLayouts,
} from "../../controller/layouts/layoutController";

// *middleware config
const layoutRoute = express.Router();

// route for handling layouts
layoutRoute.get("/components", getComponentsInLayouts);

layoutRoute.post("/components", postComponentsInLayouts);

layoutRoute.put(
  "/components",
  layoutValidator,
  putComponentsInLayouts
);

layoutRoute.delete(
  `/components/:breakpoint/:weatherId`,
  layoutValidator,
  deleteComponentsInLayouts
);

export { layoutRoute };
