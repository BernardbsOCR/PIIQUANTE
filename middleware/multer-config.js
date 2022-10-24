const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../images"),
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const fileName = "image_" + uuid().replace(/-/g, "") + ext;         

        callback(null, fileName);
    }
});

module.exports = multer({storage: storage}).single('image');