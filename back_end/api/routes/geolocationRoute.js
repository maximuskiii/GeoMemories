'use strict';
import { Db } from "../../config/db.js"
import express from "express"
import * as geoMemoryList from "../controller/geolocationController.js"

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
        if (data.command == "create-user") {
            db.createGeoM(data.title, data.text, data.lat, data.lng)
            console.log(data.text)
        } else if (data.command == "get-all-data") {
            const result = await db.findGeoM()
            console.log("result should be sending")
            await res.send(JSON.stringify(result))
        } else if (data.command == "dell-all") {
            await db.delAllGeoM()
        } else {
            console.log("I don't know the command: " + data.command)
        }
    })
};