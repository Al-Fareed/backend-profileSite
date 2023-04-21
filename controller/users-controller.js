const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const DUMMY_USERS = [
  {
    id: "u1",
    name: "Alfred",
    email: "alfred@gmail.com",
    password: "pass@alfred",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  // to validate the user inputs through validationResult, which is in user-routes.js
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid credentials entered", 422);
  }
  const { name, email, password } = req.body;

  // checks if user already exists
  const userExist = DUMMY_USERS.find((u) => u.email === email);
  if (userExist) {
    throw new HttpError("User already exists, try with other email id", 422);
  }
// creates a new user
  const createdUser = {
    id: uuid(),
    name, //similar to name :name
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

// For login
const login = (req, res, next) => {
  const { email, password } = req.body;
//   Check whether the user exists 
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || !identifiedUser.password === password) {
    throw new HttpError("User does not exist", 401);
  }
  res.json({ message: "Logged in Successfully" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
