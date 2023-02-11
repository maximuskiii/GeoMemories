'use strict';

//Imports all required paths and modules for the app to work.
import express from "express"
import bodyParser from "body-parser"
import routes from "./api/routes/geolocationRoute.js";

//Creates the express app
const  app = express();
app.set('view engine', 'ejs')

//Defines the port and Directory for the app
const  port = process.env.PORT || 5000;
const __dirname = 'C:\\Users\\maxim\\Desktop\\JoggingApp\\JoggingApp\\front_end'

//Configures bodyParser and the static directory for the middleware
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

//Creates a static endpoint through which the main page can be served.
app.get('/',(req, res) => {
    res.render("GeoMemories_Main.ejs")
})

//Allows the server to listen to traffic coming in through the chosen port.
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

import "./config/db.js"

routes(app);
