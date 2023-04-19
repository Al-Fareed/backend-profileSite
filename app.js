const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-errors');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/user-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places',placesRoutes); //middleware from places-routes
app.use('/api/users',usersRoutes); //middleware from users-routes

app.use((req,res,next)=>{
    const error = new HttpError('Could not find the place',404);
    throw  error;
});

app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500); //indicates something went wrong on the server
    res.json({message:error.message || 'An unknown error occurred!'});
});



app.listen(5000);