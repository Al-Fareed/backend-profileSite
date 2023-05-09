//* This file is used to route the user based on the places and uer id
// * Here we have only middleware and the functions are from places-controller.js

const express = require("express");

const { check } = require("express-validator");
const placesControllers = require("../controller/places-controller");
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// get place by place id
router.get("/:pid", placesControllers.getPlaceById);
// get place by user id
router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(checkAuth);

// to create a new place
router.post(
  "/",
  fileUpload.single('image'),
  [
    // validators from express validators
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
// to update a place
router.patch("/:pid", [
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 })
],placesControllers.updatePlace);
// to delete a place
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
