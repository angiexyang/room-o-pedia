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
    features: { 
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
        window_direction: {
            type: Array,
            required: false,
        },
        other: {
            type: Array,
            required: false,
        }
    }

});




const RoomWithPhotoSchema = new mongoose.Schema({
    dorm: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    features: { 
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
        window_direction: {
            type: Array,
            required: false,
        },
        other: {
            type: Array,
            required: false,
        }
    }, 
    photoURL: {
        type: Array,
        required: false
    }

});





const PhotoSchema = new mongoose.Schema({
    dorm: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    photoURL: {
        type: String
    }
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
const User = mongoose.model("User", UserSchema);
const Photo = mongoose.model("Photo", PhotoSchema);
const RoomWithPhoto = mongoose.model("RoomWithPhoto", RoomWithPhotoSchema);


module.exports = {
    Room,
    User,
    Photo,
    RoomWithPhoto,
}
