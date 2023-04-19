//* This file is used to route the user based on the places and uer id
// * Here we have only middleware and the functions are from places-controller.js

const express = require("express");
const usersControllers = require('../controller/users-controller');

const router = express.Router();

// 
router.get("/", usersControllers.getUsers);
// for new user
router.get('/signup',usersControllers.signup);
// to login 
router.post('/login',usersControllers.login);

module.exports = router;
