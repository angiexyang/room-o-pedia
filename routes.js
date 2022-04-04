const express = require("express");
const allModels = require("./models");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const Aws = require("aws-sdk");
 


// --------------- Do delete and update for ROOMWITHPHOTO  -------------------
app.post("/create_room", async (request, response) => {
    const room = new allModels.Room(request.body);

    try {
        await room.save();
        response.send(room);
    } catch (error) {
        response.status(500).send(error);
    }
});

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


// ------------------ RETRIEVE ALL ROOMS WITH PHOTO -----------------
app.get("/rooms", async (request, response) => {
    const rooms = await allModels.RoomWithPhoto.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});



// ------------------  RETRIEVE PHOTO OBJECTS FROM DB NOT NEEDED -----------------
app.get("/photos", async (request, response) => {
    const photos = await allModels.Photo.find({});

    try {
        response.send(photos);
    } catch (error) {
        response.status(500).send(error);
    }
});



// ------------------------------------------------------------------------
// ------------------ WORKING AWS S3 MONGO CONNECTION ---------------------
// ------------------------------------------------------------------------

// FILL IN  BEFORE RUNNING
AWS_ACCESS_KEY_ID = ""
AWS_ACCESS_KEY_SECRET = ""
AWS_BUCKET_NAME = "room-o-pedia-test"

const Storage = multer.memoryStorage({
    destination: function(req,file,cb) {
        cb(null, '')
    }
});

const s3 = new Aws.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY_SECRET
})


/*
const filefilter = (req, file, cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// uplooad single
const upload = multer({
    storage: Storage, 
    fileFilter: filefilter
});

// create object in mongodb and upload photo to s3 form-data
app.post('/create_room_with_photo', upload.single('photoURL'), (req, res) => {
    console.log(req.file)

    const params = { 
        Bucket: AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer, 
        ACL:"public-read-write",
        ContentType: req.file.mimetype
    };

    s3.upload(params, async function (error, photoObject) {
        if(error) {
            res.status(500).send({"err":error})
        }
        console.log(photoObject)

        const roomWithPhoto =  await new allModels.RoomWithPhoto(req.body)
        roomWithPhoto.photoURL = photoObject.Location;
        roomWithPhoto.save()
            .then(result => {
                res.status(200).send(roomWithPhoto)
            })
            .catch(err => {
                res.send({message: err})
            })
    })
})
*/




// ---------------------------------------------------------------------
// ------------------ WORKING UPLOAD MULTIPLE FILES --------------------
// ---------------------------------------------------------------------

const multipleUpload = multer ({ 
    storage: Storage 
}).array('photoURL');



app.put("/add_photoUrl/:id", function(request, response) {
    var id = request.params.id;
    var room = request.body;
    if (room && room._id != id) {
        return response.status(500).json({err: "Did not find a match."});
    }
    allModels.RoomWithPhoto.findByIdAndUpdate(id, room, {new: true}, function(err, room){
        if(err) {
            return response.status(500).json({err: err.message});
        }
        response.json({'room': room, message: "Room updated."});
    });
        
});




app.post('/create_room_with_photos', multipleUpload, function (req, res) {
    const photos = req.files;
    var photoURLs = [];

    photos.map((item) => {
        var params = {
            Bucket: AWS_BUCKET_NAME,
            Key: item.originalname,
            Body: item.buffer, 
            ACL:"public-read-write",
            ContentType: item.mimetype,
        };

        s3.upload(params, async function (err, photoObject) {
            if(err) {
                res.json({
                    "error": true, 
                    "Message": err
                });
            } else {
                photoURLs.push(photoObject.Location)
            }
            if(photoURLs.length == photos.length) {
                const roomWithPhoto =  await new allModels.RoomWithPhoto(req.body)
                roomWithPhoto.photoURL = photoURLs;
                roomWithPhoto.save()
                    .then(result => {
                        res.status(200).send(roomWithPhoto)
                    })
                    .catch(err => {
                        res.send({message: err})
                    })
            }
        })
    })
})

module.exports = app;
