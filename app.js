const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-errors");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/user-routes");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
  next();
});

app.use("/api/places", placesRoutes); //middleware from places-routes
app.use("/api/users", usersRoutes); //middleware from users-routes

app.use((req, res, next) => {
  const error = new HttpError("Could not find the place", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500); //indicates something went wrong on the server
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.connect('mongodb+srv://AlFareed:Oyl1MxjZiH5FY96l@cluster0.urwkxxh.mongodb.net/mern?retryWrites=true&w=majority')
.then(()=>{
    console.log('Connected to database ');
    
    app.listen(5000);
})
.catch(()=>{
    console.log('Error in connecting');
    
});
