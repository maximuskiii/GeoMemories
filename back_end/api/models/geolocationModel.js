import { stringify } from "css";
import  mongoose from "mongoose";

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

    createdOn: {
       type:Date,
       default:Date.now
    }
});
