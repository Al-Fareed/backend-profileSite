const { v4: uuid } = require("uuid");

const HttpError = require("../models/http-errors");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    //if found places with id then:
    // return res.status(404).json({ message: "Could not find for " + placeId }); //!we can also write this to handle error
    //TODO: handling the error in more efficient way, I am sending the error to app.js
    //   if not found places with id then:
    throw new HttpError(
      `Could not find a place for the provided id : ${placeId}`,
      404
    );
  }
  res.json({ place });
};
//   function getPlaceById(parameters){} //?we can also define in this manner

// fetching from DUMMY places to get the place by users id

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find((u) => {
    return u.creator === userId;
  });
  if (!user) {
    //if found user with id then:
    // return res.status(404).json({ message: "Could not find place with user id " + userId }); //!Instead of throwing error from here
    return next(
      //   if not found user with id then:
      new HttpError(
        `Could not find a place for the provided user id : ${userId}`,
        404
      )
    );
  }
  res.json({ user });
};

// To create a new place(Adding places)
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createPlace);

  res.status(201).json({ place: createPlace });
};

const updatePlace = (req,res,next) => {
    const { title, description} = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex  = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    
    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req,res,next) => {
    const placeId = req.params.pid;
    DUMMY_PLACES = DUMMY_PLACES.filter(p=>p.id !== placeId);
    res.status(200).json({message:'Deleted place'});
};

// To export more than one function
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;