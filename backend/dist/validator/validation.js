<<<<<<< HEAD
<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    (0, express_validator_1.body)("username")
        .isLength({ min: 2 })
=======
=======
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
import { body } from "express-validator";
export const registerValidator = [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("username")
        .isLength({ min: 2 }).isLength({ max: 30 })
<<<<<<< HEAD
>>>>>>> b387e29 (fix test file and config)
=======
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
        .withMessage("First name too short")
        .trim()
        .escape(),
    body("password")
        .isLength({ min: 6 }).isLength({ max: 20 })
        .withMessage("Password must be at least 6 characters"),
];
export const loginValidator = [
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password")
        .isLength({ min: 6 }).isLength({ max: 20 })
        .withMessage("Password must be at least 6 characters"),
];
export const layoutValidator = [
    body().isArray().withMessage("Body must be an array"),
    body("*.id")
        .isInt({ min: 0 })
        .withMessage("Each item must have a valid id (non-negative integer)"),
    body("*.componentName")
        .isString()
        .notEmpty()
        .withMessage("Each item must have a non-empty componentName"),
    body("*.componentData")
        .isString()
        .notEmpty()
        .withMessage("Each item must have a non-empty componentData"),
];
