//#region imports
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const User = require("../models/user");
//#endregion imports

//#region fetchUser
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Could not fetch users", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
//#endregion fetchUser

//#region SignUp
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  // to validate the user inputs through validationResult, which is in user-routes.js
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid credentials entered", 422));
  }

  const { name, email, password } = req.body;
  
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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createdUser = new User({
    name, //similar to name :name
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Signup failed, try again", 500));
  }
  // generating token
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!existingUser) {
    return next(new HttpError("User does not exist", 401));
  }
  let passwordIsValid = false;
  try {
    passwordIsValid = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Incorrect Password", 500));
  }

  // generating token
  let token;
  try{
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "12h" }
    );
  }catch(error)
  {
    return next(new HttpError("Logging in failed, try again", 500));
  }

  if (!passwordIsValid)
    res.json({
      userId : existingUser.id,
      email : existingUser.email,
      token :token
    });
};
//#endregion login

//#region exporting function
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
//#endregion
