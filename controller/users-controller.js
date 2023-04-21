//#region imports
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const User = require("../models/user");
//#endregion imports

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Alfred",
    email: "alfred@gmail.com",
    password: "pass@alfred",
  },
];

//#region fetchUser
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError('Could not fetch users',500));
  }
  res.json({ users: users.map(user => user.toObject({getters :true})) });
};
//#endregion fetchUser

//#region SignUp
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  // to validate the user inputs through validationResult, which is in user-routes.js
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid credentials entered", 422));
  }
  const { name, email, password, places } = req.body;
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
    places,
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Signup failed, try again", 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
//#endregion signup

//#region login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("No user found", 500));
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Incorrect password", 401));
  }

  res.json({ message: "Logged in Successfully" });
};
//#endregion login

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
