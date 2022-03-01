const {User} = require("../models/User");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");


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
                    });
                    res.redirect(`${config.clientSideUrl}/user?token=${token}`);
                }
            }
        })
    }
    deleteUser = (req, res) => {
        let id = req.params.id;
        let token = req.headers.authorization;
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
                    res.redirect("/");
                }
            }
        })
    }
}

module.exports = UserController;