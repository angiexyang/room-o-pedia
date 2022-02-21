/*
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;

const storage = new GridFsStorage({
    url: `mongodb+srv://CARL2022:CARL2022@dormrooms.9gtby.mongodb.net/DormRooms?retryWrites=true&w=majority`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "testPhotos2",
            filename: `${file.originalname}`,
        };
    },
});

module.exports = multer({ storage });
*/
