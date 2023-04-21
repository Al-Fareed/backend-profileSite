const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const User = require("../models/user");
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

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  // to validate the user inputs through validationResult, which is in user-routes.js
  if (!errors.isEmpty()) {
    return next( new HttpError("Invalid credentials entered", 422));
  }
  const { name, email, password,places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Could not Sign Up", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exist,Please login", 422));
  }
  // creates a new user
  const createdUser = new User({
    name, //similar to name :name
    email,
    image: "https://picsum.photos/200/300.webp",
    password,
    places
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Signup failed, try again", 500));
  }
  res.status(201).json({ user: createdUser.toObject({getters : true}) });
};

// For login
const login = (req, res, next) => {
  const { email, password } = req.body;
  //   Check whether the user exists
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || !identifiedUser.password === password) {
    return next(new HttpError("User does not exist", 401));
  }
  res.json({ message: "Logged in Successfully" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
