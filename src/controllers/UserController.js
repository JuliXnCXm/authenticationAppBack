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
        const objToken = new TokenController();
        let token = objToken.getToken(req,res);
        let user = req.body;
        let id = req.params.id;

        Photo.findOne({user_id: id}, (err, data) => {
            if(data) {
                user.picture =data.photourl
                if (user.password !== "" || user.password !== undefined) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            user.password = hash;
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
                        })
                    })
                }
            }
        })
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
        const photo = await Photo.find({ photoname: photoname });
        res.sendFile(path.join(__dirname, `/../storage/img/${photoname}`));
    };

    addPhoto = (req, res) => {
        const objToken = new TokenController();
        let user = jwt.decode(objToken.getToken(req,res), config.privateKey);
        Photo.deleteOne({ user_id: user.user._id }, (err, photoRemoved) => {
            if(photoRemoved) {
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
            } else {
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
                        res
                        .status(201)
                        .json({
                            message: "photo added",
                            photo,
                        });
                    } else {
                        console.log(photo);
                        res
                        .status(500)
                        .json({ message: "error", err });
                    }
                    }
                );
            }
        })
    };

    getUser = (req, res) => {
        const objToken = new TokenController();
        let user = objToken.verifyToken(req,res);
        User.findById(user.user._id, (err, user) => {
            if (err) {
            res.status(500).send({
                message: "Error al devolver los datos",
            });
            } else {
            if (!user) {
                res.status(404).send({
                message: "No hay usuarios",
                });
            } else {
                res.status(200).send({
                message: "Usuario devuelto",
                user,
                });
            }
            }
        })
    }
}

module.exports = UserController;