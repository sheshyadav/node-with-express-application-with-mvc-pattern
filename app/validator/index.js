import { body } from "express-validator";
import message from "../../lang/messages.js";
import db from "../models/index.js";
const { User } = db;

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage(message("email", { name: "email" }))
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "email" })),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "password" })),
];

export const registerValidator = [
  body("name")
    .isString()
    .withMessage(message("string", { name: "name" }))
    .isLength({ min: 3, max: 20 })
    .withMessage(message("between", { name: "name", min: 2, max: 10 }))
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "name" })),
  body("email")
    .isEmail()
    .withMessage(message("email", { name: "email" }))
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser) {
        throw new Error(message("unique", { name: "email" }));
      } else {
        return true;
      }
    })
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "email" })),

  body("password")
    .isLength({ min: 6 })
    .withMessage(message("min", { name: "password", min: "6" }))
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "password" })),
  body("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(message("notmatch"));
      } else {
        return true;
      }
    })
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "confirm password" })),
  body("agree").exists({ checkFalsy: true }).withMessage(message("agree")),
];

export const passwordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage(message("min", { name: "password", min: "6" }))
    .exists({ checkFalsy: true })
    .withMessage(message("required", { name: "password" })),
  body("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(message("notmatch"));
      } else {
        return true;
      }
    })
]