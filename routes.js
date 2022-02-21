const express = require("express");
const allModels = require("./models");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer')
 
// CREATE A ROOM
app.post("/create_room", async (request, response) => {
    const room = new allModels.Room(request.body);

    try {
        await room.save();
        response.send(room);
    } catch (error) {
        response.status(500).send(error);
    }
});


// RETRIEVE ALL ROOMS
app.get("/rooms", async (request, response) => {
    const rooms = await allModels.Room.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});



// DELETE A ROOM
app.delete("/delete_room/:id", function(request, response) {
    var id = request.params.id;
    var room = request.body;
    if (room && room._id != id) {
        return response.status(500).json({err: "Did not find a match."});
    }
    allModels.Room.findByIdAndRemove(id, function(err, room){
        if(err) {
            return response.status(500).json({err: err.message});
        }
        response.json({'room': room, message: "Room deleted."});
    });      
});



// UPDATE A ROOM
app.put("/update_room/:id", function(request, response) {
    var id = request.params.id;
    var room = request.body;
    if (room && room._id != id) {
        return response.status(500).json({err: "Did not find a match."});
    }
    allModels.Room.findByIdAndUpdate(id, room, {new: true}, function(err, room){
        if(err) {
            return response.status(500).json({err: err.message});
        }
        response.json({'room': room, message: "Room updated."});
    });
        
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
}).single('roomImage')


app.post("/upload_image", async (request, response) => {
    upload(request, response, (error)=>{
        if(error){
            response.status(500).send(error)
        } else {
            const image = new allModels.Image({
                name: request.body.name,
                image: {
                    data: request.file.filename,
                    contentType: request.file.mimetype,
                },
            });
            image.save()
                .then(()=>response.send("Successfully uploaded"))
                .catch(error=>console.log(error));

        }
    });
});

// TESTING
app.use('/uploads', express.static('uploads'));


// RETRIEVE ONE IMAGE INFO ONLY
app.get("/images/:id", (req, res) => {
    var id = req.params.id;
    allModels.Image.findById(id, (err, imageObject) => {
      if (err) {
        console.log(err);
      } else {
        res.json(imageObject);
      }
    });
  });


module.exports = app;

// TO DO DECODE BUFFER




/*
const upload = require("./middleware");

app.post("/upload_image", upload.single("file"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `http://localhost:8080/images/${req.file.filename}`;
    return res.send(imgUrl);
});


module.exports = app;
*/