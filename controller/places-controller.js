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
  try{
    place = await Place.findById(placeId);
  }catch(err)
  {
    const error = new HttpError('Something went wrong, Could not find the place',500);
    return next(error);
  }


  if (!place) {
    //if found places with id then:
    // return res.status(404).json({ message: "Could not find for " + placeId }); //!we can also write this to handle error
    //TODO: handling the error in more efficient way, I am sending the error to HttpError.js
    //   if not found places with id then:
    return next( new HttpError(
      `Could not find a place for the provided id : ${placeId}`,
      404
    ));
  }
  res.json({ place : place.toObject({getters : true}) });
};
//   function getPlaceById(parameters){} //?we can also define in this manner

// fetching from DUMMY places to get the place by users id

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((u) => {
    return u.creator === userId;
  });
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
  res.json({ places });
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
const updatePlace = (req, res, next) => {
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
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  // update the place
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};
// =--------------------------------------------------------------------
// to delete place based on the id
const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Place does not exist", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place" });
};

// To export more than one function
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
