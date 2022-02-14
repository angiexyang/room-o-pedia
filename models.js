const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    dorm: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;