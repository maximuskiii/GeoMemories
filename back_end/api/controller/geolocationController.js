import * as geoMemory from "../models/geolocationModel.js"

// DEFINE CONTROLLER FUNCTIONS


// listAllmemroies function - To list all memories 
export let listGeoMemory = (req, res) => {
    geoMemory.find({}, (err, geoMem) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(geoMem);
    });
};

// createNewmemory function - To create new memory
export let createNewGeoMemory = (req, res) => {
    let  newGeoMemory = new geoMem (req.body);
        newGeoMemory.save((err, geoMem) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(201).json(geoMem);
    });
};

// updateMemory function - To update memory status by id
export let updateGeoMemory = (req, res) => {
    Todo.findOneAndUpdate({ _id:req.params.id }, req.body, { new:true }, (err, geoMem) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(geoMem);
    });
};

// deleteMemory function - To delete memory by id
export let deleteGeoMemory = async ( req, res) => {
    await  geoMemory.deleteOne({ _id:req.params.id }, (err) => {
        if (err) {
            return res.status(404).send(err);       
        }
        res.status(200).json({ message:"Geomemory successfully deleted"});
    });
};