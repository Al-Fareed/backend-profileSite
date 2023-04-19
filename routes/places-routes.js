const express = require("express");
const HttpError = require("../models/http-errors");
const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous place you know",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th street, New York 1001",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    //if found places with id then:
    // return res.status(404).json({ message: "Could not find for " + placeId }); //!we can also write this to handle error
    //TODO: handling the error in more efficient way, I am sending the error to app.js
    //   if not found places with id then:
    throw new HttpError(`Could not find a place for the provided id : ${placeId}`, 404);
  }
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find((u) => {
    return u.creator === userId;
  });
  if (!user) {
    //if found user with id then:
    // return res.status(404).json({ message: "Could not find place with user id " + userId }); //!Instead of throwing error from here
    return next(
        //   if not found user with id then:
        new HttpError(`Could not find a place for the provided user id : ${userId}`, 404)
      );
  }
  res.json({ user });
});

module.exports = router;
