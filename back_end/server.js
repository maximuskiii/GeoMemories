//npm run devStart
'use strict';

// require express and bodyParser
import path from 'path'
import express from "express"
import bodyParser from "body-parser"
import routes from "./api/routes/geolocationRoute.js";

// create express app
const  app = express();
app.set('view engine', 'ejs')

// define port to run express app
const  port = process.env.PORT || 5000;
const __dirname = 'C:\\Users\\maxim\\Desktop\\JoggingApp\\JoggingApp\\front_end' //path.resolve(path.dirname(''))

// use bodyParser middleware on express app
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Add endpoint
app.get('/',(req, res) => {
    res.render("Jogging_App_Main.ejs")
}) 


// Listen to server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

import "./config/db.js"


//var routes = require('./api/routes/geolocationRoute');
routes(app);
