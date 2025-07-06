import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),

  body("username")
    .isLength({ min: 14 })
    .withMessage("First name too short")
    .trim()
    .escape(),


  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];
