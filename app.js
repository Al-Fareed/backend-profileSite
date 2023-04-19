const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use('/api/:places',placesRoutes); //middleware from places-routes

app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500); //indicates something went wrong on the server
    res.json({message:error.message || 'An unknown error occured!'});
});



app.listen(5000);