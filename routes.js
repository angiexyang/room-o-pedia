const express = require("express");
const roomModel = require("./models");
const app = express();

// CREATE A ROOM
app.post("/create", async (request, response) => {
    const room = new roomModel(request.body);

    try {
        await room.save();
        response.send(room);
    } catch (error) {
        response.status(500).send(error);
    }
});

// put more specific data to make it easier for iPhone later
// Eg: var room = new roomModel ({
//     dorm: request.get("dorm"),
//     number: request.get("number"),
//})
// may use room.isNew to check if both server and db updated



// RETRIEVE ALL ROOMS
app.get("/rooms", async (request, response) => {
    const rooms = await roomModel.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});



// DELETE A ROOM
app.post("/delete", async (request, response) => {
    roomModel.findOneAndRemove({
        _id: request.get("id")
    }, (error) => {
        console.log("Failed to delete" + error)
    })
    response.send("Deleted")
});


// UPDATE A ROOM
app.post("/update", async (request, response) => {
    roomModel.findOneAndUpdate({
        _id: request.get("id")
    }, {
        dorm: request.get("dorm"),
        number: request.get("number")
    }, (error) => {
        console.log("Failed to update" + error)
    })
    response.send("Updated")
});


module.exports = app;