"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    (0, express_validator_1.body)("username")
        .isLength({ min: 2 })
        .withMessage("First name too short")
        .trim()
        .escape(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 }).isLength({ max: 20 })
        .withMessage("Password must be at least 6 characters"),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 }).isLength({ max: 20 })
        .withMessage("Password must be at least 6 characters"),
];
exports.layoutValidator = [
    (0, express_validator_1.body)().isArray().withMessage("Body must be an array"),
    (0, express_validator_1.body)("*.id")
        .isInt({ min: 0 })
        .withMessage("Each item must have a valid id (non-negative integer)"),
    (0, express_validator_1.body)("*.componentName")
        .isString()
        .notEmpty()
        .withMessage("Each item must have a non-empty componentName"),
    (0, express_validator_1.body)("*.componentData")
        .isString()
        .notEmpty()
        .withMessage("Each item must have a non-empty componentData"),
];
