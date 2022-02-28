const express = require("express");
const allModels = require("./models");
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

const Aws = require("aws-sdk");
 
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

/*
// RETRIEVE ALL ROOMS
app.get("/rooms", async (request, response) => {
    const rooms = await allModels.Room.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});*/




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
/* const Storage = multer.diskStorage({
    destination: 'uploads',
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    },
}); */




const Storage = multer.memoryStorage({
    destination: function(req,file,cb) {
        cb(null, '')
    }
});



// AWS TEST 
// FILL IN  BEFORE RUNNING 

AWS_ACCESS_KEY_ID = ""
AWS_ACCESS_KEY_SECRET = ""
AWS_BUCKET_NAME = "room-o-pedia-test"

const filefilter = (req, file, cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: Storage, 
    fileFilter: filefilter
});


const s3 = new Aws.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY_SECRET
})

// UPLOAD TO AWS AND ADD TO DB

app.post('/upload_photo', upload.single('photoURL'), (req, res) => {
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

        const photo =  await new allModels.Photo({
            dorm: req.body.dorm,
            number: req.body.number,
            photoURL: photoObject.Location
        });
        photo.save()
            .then(result => {
                res.status(200).send({
                    _id: result._id,
                    dorm: result.dorm,
                    number: result.number,
                    photoURL: photoObject.Location,
                })
            })
            .catch(err => {
                res.send({message: err})
            })
    })
})


// RETRIEVE PHOTO OBJECTS FROM DB
app.get("/photos", async (request, response) => {
    const photos = await allModels.Photo.find({});

    try {
        response.send(photos);
    } catch (error) {
        response.status(500).send(error);
    }
});


// TEST NEW MODEL ROOM WITH PHOTO

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



// RETRIEVE ALL ROOMS WITH PHOTO
app.get("/rooms", async (request, response) => {
    const rooms = await allModels.RoomWithPhoto.find({});

    try {
        response.send(rooms);
    } catch (error) {
        response.status(500).send(error);
    }
});


module.exports = app;
