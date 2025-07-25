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
layoutRoute.get("/componentsInLayouts", getComponentsInLayouts);

layoutRoute.post("/componentsInLayouts", postComponentsInLayouts);

layoutRoute.put(
  "/componentsInLayouts",
  layoutValidator,
  putComponentsInLayouts
);

layoutRoute.delete(
  `/componentsInLayouts/:breakpoint/:weatherId`,
  layoutValidator,
  deleteComponentsInLayouts
);

export { layoutRoute };
