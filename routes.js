const express = require("express");
const roomModel = require("./models");
const app = express();

app.post("/add_room", async (request, response) => {
    const room = new roomModel(request.body);

    try {
        await room.save();
        response.send(room);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/rooms", async (request, response) => {
    const rooms = await roomModel.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;