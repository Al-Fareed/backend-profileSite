const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-errors");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
// creating a dummy place
let DUMMY_PLACES = [
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

// fetching from DUMMY places to get the place by its ID
// =--------------------------------------------------------------------
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find the place",
      500
    );
    return next(error);
  }

  if (!place) {
    //if found places with id then:
    // return res.status(404).json({ message: "Could not find for " + placeId }); //!we can also write this to handle error
    //TODO: handling the error in more efficient way, I am sending the error to HttpError.js
    //   if not found places with id then:
    return next(
      new HttpError(
        `Could not find a place for the provided id : ${placeId}`,
        404
      )
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};
//   function getPlaceById(parameters){} //?we can also define in this manner

// fetching from DUMMY places to get the place by users id

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpError("Could not find place by user id", 500));
  }
  if (!places || places.length === 0) {
    //if found user with id then:
    // return res.status(404).json({ message: "Could not find place with user id " + userId }); //!Instead of throwing error from here
    return next(
      //   if not found user with id then:
      new HttpError(
        `Could not find a places for the provided user id : ${userId}`,
        404
      )
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

// =--------------------------------------------------------------------
// To create a new place(Adding places)
const createPlace = async (req, res, next) => {
  // checks for the validation, i.e., sent from places-routes
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors);
    return next(new HttpError("Invalid inputs", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "https://picsum.photos/200/300.webp",
    creator,
  });
  // DUMMY_PLACES.push(createPlace); if we don't have db then try with this for creating documents
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};
// =--------------------------------------------------------------------
// To update places
const updatePlace = async (req, res, next) => {
  // check for the inputs from user
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs", 422);
  }
  // get the value from user after checking for the inputs
  const { title, description } = req.body;
  const placeId = req.params.pid;

  // check for the place existence
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // #region without db
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  // // update the place
  //#endregion without db

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not update", 500));
  }
  place.title = title;
  place.description = description;
  // DUMMY_PLACES[placeIndex] = updatedPlace;
  try {
    await place.save();
  } catch (err) {
    return next(new HttpError("Something went wrong, couldn't update", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};
// =--------------------------------------------------------------------
// to delete place based on the id
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find place to delete", 500));
  }
  try {
    await place.deleteOne();
  } catch (error) {
    return next(new HttpError("Could not delete place", 500));
  }
  res.status(200).json({ message: "Deleted place" });
};

// To export more than one function
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
