//#region imports
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//#endregion

//#region creating schema for place
const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
  creator: { type: mongoose.Types.ObjectId,required :true, ref :'User' }
  // the above line will establish connection between place and User schema, through ref
});
//#endregion

//#region exporting the function
module.exports = mongoose.model('Place',placeSchema); //created Schema exports
//#endregion
