import express from "express";

const healthRouter = express.Router();

healthRouter.get("/", (req, res) => {
  res.status(200).json({ status: "good" });
});

export default healthRouter;
