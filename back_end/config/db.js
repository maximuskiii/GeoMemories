import mongoose from "mongoose";
import { geolocationSchema } from "../api/models/geolocationModel.js"
//Defines the URI at which the connection will occur and static values such as the URI and naming conventions for the standard data item stored in the DB.
const uri = "mongodb+srv://maximyagnyatinskiy:3MWmnrcgFdbMxnY0@cluster0.rl2gcl7.mongodb.net/?retryWrites=true&w=majority";
const GeoM = mongoose.model('GeoM', geolocationSchema)

//Defines the options that are going to be used by the mongoose connection when transporting data.
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

//Defines the standard class of the DB with all the accessible DB callable commands.
export class Db {
    constructor() {
        this.connection = null
    }

    //Creates a new DB connection through Mongoose at the uri, while applying the options above.
    async connect() {
        this.connection = await mongoose.connect(uri, options)
        console.log("Database connection established!");    
   }

   //Creates a new GeoMemory with the properties passed on from the server
   async createGeoM(title, text, lat, lng, img_src) {
     const geom1 = new GeoM({"title": title, "text": text, "lat_coord": lat, "lng_coord": lng, "img_src": img_src})
     console.log(geom1)
     await geom1.save()
     return true 
   }
   
   //Deletes all GeoMemories by filtering all that are GeoMemories
   async delAllGeoM() {
        console.log("successful wipe")
        return await GeoM.deleteMany({})
   }

   //Deletes one GeoMemory by filtering by title - finds on with a matching title and deletes it
   async delOne(title) {
        console.log("successful deletion")
        return await GeoM.findOneAndDelete({"title": title});
   }

   //Finds all GeoMemories by filtering all that are GeoMemories
   async findGeoM() {
        console.log("finding geoM")
        return await GeoM.find({})
   }

   //Updates one GeoMemory with the specified properties, by filtering with an arbitrary
   async updateGeoM(fetchTitle, title, text, lat, lng, img_src) {
          console.log("updating GeoM")
          const filter = {title: fetchTitle}
          const update = {
               title: title, 
               text: text, 
               lat_coord: lat, 
               lng_coord: lng, 
               img_src: img_src,
          }
          let doc = await GeoM.findOneAndUpdate(filter, update, {
               returnDocument: true
          })
          console.log("completed update")
   }
}
