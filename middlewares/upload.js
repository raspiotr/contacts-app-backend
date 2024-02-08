const multer = require("multer");
const path = require("path");

const tmpDirectory = path.join(__dirname, "../", "tmp");

const storage = multer.diskStorage({
  destination: tmpDirectory,
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
