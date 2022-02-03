const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    dorm: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        default: 0,
    },
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;