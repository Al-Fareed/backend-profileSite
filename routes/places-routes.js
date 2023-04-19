//* This file is used to route the user based on the places and uer id

const express = require("express");
const placesControllers = require('../controller/places-controller');

const router = express.Router();


router.get("/:pid", placesControllers.getPlaceById);

router.get('/user/:uid',placesControllers.getPlaceByUserId);

router.post('/',placesControllers.createPlace);

module.exports = router;
