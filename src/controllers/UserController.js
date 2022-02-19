const { UserSchema, User } = require("../models/User");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const cookieParser = require("cookie-parser");
const request = require("request");
const { OauthOptions } = require("../utils/OauthOptions");
const URLSearchParams = require("@ungap/url-search-params");



class UserController {
    constructor() {
        this.provider = "";
    }
        getUserInfo = (accessToken) => {
            if (!accessToken) {
                return Promise.resolve(null);
            }
            const options = OauthOptions.exchangeOptions[this.provider].options;
            options.headers['Authorization'] = `${options['token_type']} ${accessToken}`;
            return new Promise((resolve, reject) => {
                request.get(options, (error, response, body) => {
                    if (error || response.statusCode !== 200) {
                        reject(error);
                    }
                    resolve(body);
                });
            });
        };

        getThirdUser = async (req, res, next) => {
            const { access_token: accessToken } = req.query;
            if (
                !accessToken ||
                !req.query.access_token ||
                !accessToken === undefined
            ) {
            return res.redirect("/");
            }

            try {
                const userInfo = await this.getUserInfo(accessToken, this.provider);
                res.json({user: userInfo});
            } catch (error) {
                next(error);
            }
        };

        loginFromProvider = (req, res) => {
            this.provider = req.url.split("/").at(-1);
            const objProvider = OauthOptions.queryStrings[this.provider];
            const params = new URLSearchParams(objProvider.params);
            res.cookie("auth_state", objProvider.params.state, { httpOnly: true });

            res.redirect(`${objProvider.url}${params}`)
        };


        callbackProvider = (req, res, next) => {
            const { code, state } = req.query;
            if (state === null || state !== req.cookies.auth_state) {
                next(boom.unauthorized("Invalid state"));
            }
            res.clearCookie("auth_state");

            const objProvider = OauthOptions.queryAuth[this.provider];
            objProvider.queryAuthOptions['code'] = code;
            const params = new URLSearchParams(objProvider.queryAuthOptions)

            const authOptions = {
                url: `${objProvider.url}${params}`,
                headers: {
                    Accept: "application/json",
                },
            };
            request.post(authOptions, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    boom.unauthorized("Invalid token");
                }
                res.cookie("access_token", JSON.parse(body).access_token, {
                    httpOnly: true,
                });
                const query = new URLSearchParams({
                    access_token: JSON.parse(body).access_token,
                });
                res.redirect("https://authappchallenge.herokuapp.com/user?" + query);
            });
        };

        login = (req, res) => {
            let user = req.body;
            const { error, value } = UserSchema.validate(user);
            if (!error) {
            User.findOne({ email: value.email }, (err, user) => {
                if (!user) {
                res.status(404).send({
                    message: "Usuario no encontrado",
                });
                } else {
                bcrypt.compare(value.password, user.password, (err, result) => {
                    if (result === false) {
                    boom.unauthorized("Contraseña incorrecta");
                    } else {
                    let token = jwt.sign({ user: user }, config.privateKey, {
                        expiresIn: "1h",
                    });
                    res.status(200).send({
                        message: "Usuario autenticado",
                        token: token,
                    });
                    }
                });
                }
            });
            }
        };

        register = (req, res) => {
            let user = req.body;
            const { error, value } = UserSchema.validate(user);
            if (!error) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(value.password, salt, (err, hash) => {
                User.create({ email: value.email, password: hash }, (err, data) => {
                    if (err) {
                    res.status(500).send({
                        message: "Error al registrar",
                    });
                    } else {
                    if (data != null) {
                        console.log(data);
                        let token = jwt.sign({ user: data }, config.privateKey, {
                        expiresIn: "1h",
                        });
                        res.status(200).send({
                        message: "Usuario registrado",
                        token: token,
                        });
                    } else {
                        res.status(404).send({
                        message: "Usuario no registrado",
                        });
                    }
                    }
                });
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

module.exports = UserController;
