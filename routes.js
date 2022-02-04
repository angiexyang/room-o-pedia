const express = require("express");
const allModel = require("./models");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer')

// CREATE A ROOM
app.post("/create_room", async (request, response) => {
    const room = new allModel.Room(request.body);

    try {
        await room.save();
        response.send(room);
    } catch (error) {
        response.status(500).send(error);
    }
});

// UPLOAD AN IMAGE TO DB

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage
}).single('testImage')

app.post("/upload_image", async (request, response) => {
    upload(request, response, (error)=>{
        if(error){
            response.status(500).send(error)
        } else {
            const image = new allModel.Image({
                name: request.body.name,
                image: {
                    data: request.file.filename,
                    contentType: "image/png",
                },
            });
            image.save()
                .then(()=>response.send("Successfully uploaded"))
                .catch(error=>console.log(error));

        }
    });
});


// put more specific data to make it easier for iPhone later
// Eg: var room = new roomModel ({
//     dorm: request.get("dorm"),
//     number: request.get("number"),
//})
// may use room.isNew to check if both server and db updated



// RETRIEVE ALL ROOMS
app.get("/rooms", async (request, response) => {
    const rooms = await allModel.Room.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});



// DELETE A ROOM
app.post("/delete_room", async (request, response) => {
    allModel.Room.findOneAndRemove({
        _id: request.get("id")
    }, (error) => {
        console.log("Failed to delete" + error)
    })
    response.send("Deleted")
});


// UPDATE A ROOM
app.post("/update_room", async (request, response) => {
    allModel.Room.findOneAndUpdate({
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