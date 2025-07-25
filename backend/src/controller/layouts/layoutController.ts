import { CustomError, Layout } from "@/types/type";
import { Request, Response } from "express";
import {
  fetchLayout,
  createComponentsInLayout,
  deleteComponentsAtBreakpoint,
  updateComponentsAtBreakpoint,
} from "../../services/layoutServices";

//^ get
const getComponentsInLayouts = async (req: Request, res: Response) => {
  // extracting the token
  const decoded = req.decoded;

  if (!decoded) {
    const error: CustomError = new Error("user id is not found");
    error.status = 401;
    throw error;
  }
  const dataGrid = await fetchLayout(decoded.userId);
  res.status(200).json(dataGrid);
  return;
};

//^ post
const postComponentsInLayouts = async (req: Request, res: Response) => {
  const { newComp, breakpoint }: { newComp: Layout; breakpoint: string } =
    req.body;

  if (!req.decoded || !newComp || !breakpoint) {
    const error: CustomError = new Error("missing the required fields");
    error.status = 400;
    throw error;
  }
  const userId = req.decoded.userId;

  if (!userId) {
    const error: CustomError = new Error("missing the required fields");
    error.status = 400;
    throw error;
  }
  await createComponentsInLayout({ breakpoint, userId, newComp });
  res.status(201).json({ message: "Component created successfully" });
  return;
};

//^ put
// update layout function
const putComponentsInLayouts = async (req: Request, res: Response) => {
  const decoded = req.decoded;
  const layouts: { [key: string]: Layout[] } = req.body.layouts;

  if (!decoded || !layouts) {
    const error: CustomError = new Error("missing the required fields");
    error.status = 400;
    throw error;
  }

  // data: [lg: [{dataGrid}, {dataGrid:2}], md:]
  // remove & update the changes
  const userId = decoded.userId;
  await updateComponentsAtBreakpoint({ userId, layouts });
  res.status(200).json({ message: "layout saved successfully" });
  return;
};

//^ delete
// delete component in layout

const deleteComponentsInLayouts = async (req: Request, res: Response) => {
  const decoded = req.decoded;
  const { weatherId, breakpoint } = req.params;

  if (!weatherId || !breakpoint || !decoded) {
    const error: CustomError = new Error("missing the required fields");
    error.status = 400;
    throw error;
  }
  // data: [lg: [{dataGrid}, {dataGrid:2}], md:]
  // remove
  const userId = decoded.userId
  await deleteComponentsAtBreakpoint({ userId, weatherId, breakpoint });
  res.status(202).json({ message: "layout deleted successfully" });
  return;
};

export {
  getComponentsInLayouts,
  postComponentsInLayouts,
  putComponentsInLayouts,
  deleteComponentsInLayouts,
};
