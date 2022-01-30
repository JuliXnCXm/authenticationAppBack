const {UserSchema, User} = require( "../models/User" );
const jwt = require( "jsonwebtoken" );
const {config} = require('../config/config');
const bcrypt = require( "bcrypt" );
const boom = require('@hapi/boom');

class UserController {


    login = (req, res) => {
        let user = req.body;
        const { error, value } = UserSchema.validate(user);
        if (!error) {
            User.findOne({ email: value.email}, (err, user) => {
                if (!user) {
                    res.status(404).send({
                        message: "Usuario no encontrado"
                    })
                } else {
                    bcrypt.compare(value.password, user.password,  (err, result) => {
                        if (result === false) {
                            boom.unauthorized("Contraseña incorrecta");
                        } else {
                            let token = jwt.sign({ user: user }, config.privateKey, { expiresIn: '1h' })
                            res.status(200).send({
                                message: "Usuario autenticado",
                                token: token
                            })
                        }
                    })
                }
            })
        }
    }

    register = (req, res) => {
        let user = req.body
        const {error, value } = UserSchema.validate(user);
        if (!error) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(value.password, salt, (err, hash) => {
                    User.create({email: value.email, password: hash}, (err , data) => {
                        if (err) {
                            res.status(500).send({
                                message: "Error al registrar"
                            })
                        } else {
                            if(data != null) {
                                console.log(data)
                                let token = jwt.sign({ user: data }, config.privateKey, { expiresIn: '1h' })
                                res.status(200).send({
                                    message: "Usuario registrado",
                                    token: token
                                })
                            } else {
                                res.status(404).send({
                                    message: "Usuario no registrado"
                                })
                            }
                        }
                    } )
                })
            });
        } else {
            res.status(400).send({
                message: "Error al registrar",
                info: error
            })
        }
    }
}

module.exports = UserController;