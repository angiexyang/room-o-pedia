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


const ImageSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    image:{
        data: Buffer,
        contentType: String
    },
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    number: {
        type: Number,
        default: 0,
    },
});


const Room = mongoose.model("Room", RoomSchema);
const Image = mongoose.model("Image", ImageSchema);
const User = mongoose.model("User", UserSchema);


module.exports = {
    Room,
    Image,
    User,
}
