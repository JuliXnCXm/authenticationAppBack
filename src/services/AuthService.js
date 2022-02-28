const { UserSchema, User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const UserConstructor = require("../utils/UserConstructor");
const moment = require("moment");


class AuthService {
    constructor() {
        this.provider = "";
    }
    login = (req, res) => {
        let user = req.body;
        this.provider = "local";
        const { error, value } = UserSchema.validate(user);
        if (!error) {
        User.findOne({ email: value.email }, (err, user) => {
            if (!user) {
            res.status(404).send({
                message: "Error al obtener usuario o usuario no encontrado",
            });
            } else {
                bcrypt.compare(value.password, user.password, (err, result) => {
                    if (result === false) {
                    boom.unauthorized("Contraseña incorrecta");
                    } else {
                    let token = jwt.sign({ user: user }, config.privateKey, {
                        expiresIn: moment().add(14, "days").unix(),
                    });
                    // res.redirect(`${config.clientSideUrl}/user?token=${token}`)
                    res.status(200).send({
                        message: "Usuario autenticado",
                    });
                    res.redirect(`/user?token=${token}`);
                    }
                });
            }
        });
        }
    };

    register = (req, res) => {
        let user = req.body;
        this.provider = "local";
        const { error, value } = UserSchema.validate(user);
        if (!error) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(value.password, salt, (err, hash) => {
                let user = UserConstructor(value, this.provider, hash);
                User.findOne({ email: user.email }, (err, data) => {
                    if(!data || data === null || data === undefined || Object.keys(data).length > 4) {
                        User.create(user, (err, user) => {
                            if (!err) {
                                let token = jwt.sign(
                                    { user: user },
                                    config.privateKey,
                                    {
                                        expiresIn: moment().add(14, "days").unix(),
                                    }
                                );
                                // res.redirect(`${config.clientSideUrl}/user?token=${token}`);
                                res.status(200).json({
                                    message: "Usuario creado",
                                })
                                res.redirect(`/user?token=${token}`);
                            } else {
                                res.status(401).send({
                                    message: "Error al registrar usuario",
                                });
                                res.redirect("/");
                                }
                            });
                    } else {
                        res.status(401).send({
                            message: "Error user already exists",
                        });
                        res.redirect("/");
                    }
                })
            });
        });
        } else {
        res.status(400).send({
            message: "Error al registrar",
            info: error,
        });
        }
    };

}


module.exports = AuthService;