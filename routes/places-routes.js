//* This file is used to route the user based on the places and uer id
// * Here we have only middleware and the functions are from places-controller.js

const express = require("express");

const { check } = require("express-validator");
const placesControllers = require("../controller/places-controller");

const router = express.Router();

// get place by place id
router.get("/:pid", placesControllers.getPlaceById);
// get place by user id
router.get("/user/:uid", placesControllers.getPlacesByUserId);
// to create a new place
router.post(
  "/",
  [
    // validators from express validators
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
// to update a place
router.patch("/:pid", placesControllers.updatePlace);
// to delete a place
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
