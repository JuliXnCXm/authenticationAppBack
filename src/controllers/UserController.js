const {User} = require("../models/User");
const Photo = require("../models/Photo");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const path = require("path");
const bcrypt = require("bcrypt");
const TokenController = require( "./TokenController" );

class UserController {
    updateUser = (req, res) => {
        let token = req.headers.authorization;
        let user = req.body;
        let id = req.params.id;
        User.findByIdAndUpdate(id, user, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
            message: "Error al actualizar el usuario",
            });
        } else {
            if (!userUpdated) {
            res.status(404).send({
                message: "No se ha podido actualizar el usuario",
            });
            } else {
            token = jwt.sign({ user: userUpdated }, config.privateKey, {
                expiresIn: moment().add(14, "days").unix(),
            });
            res.status(200).send({
                message: "user updated",
                token: token,
            });
            }
        }
        });
    };

    deleteUser = (req, res) => {
        let id = req.params.id;
        User.findByIdAndRemove(id, (err, userRemoved) => {
        if (err) {
            res.status(500).send({
            message: "Error al eliminar el usuario",
            });
        } else {
            if (!userRemoved) {
            res.status(404).send({
                message: "No se ha podido eliminar el usuario",
            });
            res.redirect("/");
            } else {
            res.status(200).send({
                message: "user deleted",
            });
            }
        }
        });
    };

    getPhoto = async (req, res) => {
        let { photoname } = req.params;
        console.log(photoname);
        const photo = await Photo.find({ photoname: photoname });
        console.log(photo);
        res.sendFile(path.join(__dirname, `/../storage/img/${photo.photoname}`));
    };

    addPhoto = (req, res) => {
        const objToken = new TokenController();
        let user = jwt.decode(objToken.getToken(req), config.privateKey);
        console.log(new Date());
        console.log(`${config.url}${req.file.filename}`);
        Photo.create(
        {
            photoname: req.file.originalname,
            path: `storage/img/${req.file.filename}`,
            photourl: `${config.url}user/${req.file.originalname}`,
            mimetype: req.file.mimetype,
            created: new Date(),
            user_id: user.user._id,
        },
        (err, photo) => {
            console.log(photo);
            if (!err) {
            photo.save();
            res.status(201).json({ message: "photo added", photo });
            } else {
            console.log(photo);
            res.status(500).json({ message: "error", err });
            }
        }
    );
    };
}

module.exports = UserController;