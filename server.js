const express = require('express');
const mongoose = require('mongoose');
const Router = require('./routes');
const app = express();
const bodyParser = require('body-parser');

//const multer = require('multer')

/*
const Grid = require("gridfs-stream");
let gfs, gridFsBucket;

app.use(express.json());

mongoose.connect(
    `mongodb+srv://CARL2022:CARL2022@dormrooms.9gtby.mongodb.net/DormRooms?retryWrites=true&w=majority`,
);

const conn = mongoose.connection;
conn.once("open", function () {
    gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'testPhotos2'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("testPhotos2");
});

app.use(Router);

// media routes
app.get("/images/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gridFsBucket.openDownloadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
*/


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



mongoose.connect(
    `mongodb+srv://CARL2022:CARL2022@dormrooms.9gtby.mongodb.net/DormRooms?retryWrites=true&w=majority`,
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.use(Router);

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});




