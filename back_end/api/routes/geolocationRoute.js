'use strict';
import { Db } from "../../config/db.js"
import express from "express"
import * as geoMemoryList from "../controller/geolocationController.js"

// mention concurrency problem in criterion C, Add UML sequence diagram
export default function(app) {
    app
    .route("/geos")
    .get(geoMemoryList.listGeoMemory)
    .post(geoMemoryList.createNewGeoMemory)

    app
    .route("/geos/:id")
    .put(geoMemoryList.updateGeoMemory)
    .delete(geoMemoryList.deleteGeoMemory)
    
    app
    .use(express.json())
    .get("/geos/server", async (req, res) => {
        res.send(JSON.stringify())
    })
    .post("/geos/server", async (req, res) => {
        const data = req.body
        const db = new Db()
        db.connect()
        if (data.command == "create-geom") {
            await db.createGeoM(data.title, data.text, data.lat, data.lng, data.img_src)
            console.log(data.text, data.img_src)
            res.send('"UPDATE OK FROM SERVER"')
        } else if (data.command == "get-all-data") {
            const result = await db.findGeoM()
            console.log("result should be sending")
            await res.send(JSON.stringify(result))
        } else if (data.command == "del-all") {
            await db.delAllGeoM()
            res.send('"UPDATE OK FROM SERVER"')
        }else if (data.command == "del-one") {
            await db.delOne(data.title)
            console.log("succesful deletion")
            res.send('"UPDATE OK FROM SERVER"')
        } else if(data.command =="update-one") {
            console.log("updating")
            await db.updateGeoM(data.fetchTitle, data.title, data.text, data.lat, data.lng, data.img_src)
            res.send('"UPDATE OK FROM SERVER"')
        }else{
            console.log("I don't know the command: " + data.command)
        }
    })
};