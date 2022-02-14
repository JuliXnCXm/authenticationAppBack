const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../storage/img"));
  },
  filename: (req, file, cb) => {
    let formContentFile = JSON.parse(req.body.fileForm);
    cb(null, formContentFile.label + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
