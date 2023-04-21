//* This file is used to route the user based on the places and uer id
// * Here we have only middleware and the functions are from places-controller.js

const express = require("express");
// const HttpError = require('../models/http-errors');
const { check } = require("express-validator");
const usersControllers = require("../controller/users-controller");

const router = express.Router();

//
router.get("/", usersControllers.getUsers);
// for new user
router.post(
  '/signup',
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), //checks the email is valid or not
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);
// to login
router.post("/login", usersControllers.login);

module.exports = router;
