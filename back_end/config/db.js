import mongoose from "mongoose";
import { deleteGeoMemory } from "../api/controller/geolocationController.js";
import { geolocationSchema } from "../api/models/geolocationModel.js"
const uri = "mongodb+srv://maximyagnyatinskiy:3MWmnrcgFdbMxnY0@cluster0.rl2gcl7.mongodb.net/?retryWrites=true&w=majority";
const GeoM = mongoose.model('GeoM', geolocationSchema)

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

export class Db {
    constructor() {
        this.connection = null
    }

    async connect() {
        this.connection = await mongoose.connect(uri, options)
        console.log("Database connection established!");    
   }

   async createGeoM(title, text, lat, lng, img_src) {
     const geom1 = new GeoM({"title": title, "text": text, "lat_coord": lat, "lng_coord": lng, "img_src": img_src})
     console.log(geom1)
     await geom1.save()
     return true 
   }
   
   async delAllGeoM() {
        console.log("successful wipe")
        return await GeoM.deleteMany({})
   }

   async delOne(title) {
        console.log("successful deletion")
        return await GeoM.findOneAndDelete({"title": title});
   }

   async findGeoM() {
        console.log("finding geoM")
        return await GeoM.find({})
   }

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
