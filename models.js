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
    features: 
        { 
            floor: {
                type: String,
                required: true,
            },
            occupancy: {
                type: String, 
                required: true,
            },
            cooling_system: {
                type: String,
                required: true,
            },
            storage: {
                type: Array,
                required: true,
            },
            flooring: {
                type: String,
                required: true,
            },
            other: {
                type: Array,
                required: false,
            }
        }
    
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
