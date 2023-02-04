import { stringify } from "css";
import  mongoose from "mongoose";

//Creates the model for the JSON object that will be stored in the Database - defines the standard data item stored in the database.
const Schema = mongoose.Schema;

export const geolocationSchema = new Schema({
    title: {
        type:String, 
    }, 

    text: {
        type:String, 
    },

    lat_coord: {
       type:String,
    }, 

    lng_coord: {
        type:String,
    }, 

    img_src: {
        type:String,
    },

    createdOn: {
       type:Date,
       default:Date.now
    }, 
});
