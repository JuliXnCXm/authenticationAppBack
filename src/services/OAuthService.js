const request = require("request");
const { User, UserSchema } = require("../models/User");
const jwt = require("jsonwebtoken");
const { OauthOptions } = require("../utils/OauthOptions");
const { config } = require("../config/config");
const URLSearchParams = require("@ungap/url-search-params");
const UserConstructor = require("../utils/UserConstructor");
const boom = require("@hapi/boom");
const moment = require("moment");


class OAuthService {
    constructor() {
        this.provider = "";
        this.state = "";
    }

    accessFromProvider = (req, res) => {
        this.state = req.params.state;
        this.provider = req.url.split("/").at(-2);
        const objProvider = OauthOptions.queryStrings[this.provider];
        console.log(OauthOptions.queryStrings[this.provider]);
        const params = new URLSearchParams(objProvider.params);
        console.log(objProvider.url);
        res.cookie("auth_state", objProvider.params.state, { httpOnly: true });
        res.redirect(`${objProvider.url}${params}`);
    };

    callbackProvider = (req, res, next) => {
        const { code, state } = req.query;
        if (state === null || state !== req.cookies.auth_state) {
        next(boom.unauthorized("Invalid state"));
        }
        res.clearCookie("auth_state");

        const objProvider = OauthOptions.queryAuth[this.provider];
        objProvider.queryAuthOptions["code"] = code;
        const params = new URLSearchParams(objProvider.queryAuthOptions);

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
        res.redirect(
            `/oauth/${this.state}/user?${query}`
        );
        });
    };

    exchangeToken = (accessToken) => {
        if (!accessToken) {
        return Promise.resolve(null);
        }
        const options = OauthOptions.exchangeOptions[this.provider].options;
        options.headers[
        "Authorization"
        ] = `${options["token_type"]} ${accessToken}`;
        return new Promise((resolve, reject) => {
            request.get(options, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                reject(boom.unauthorized("Invalid token"));
                } else {
                resolve(body);
                }
            });
        });
    };

    exchangeUserLogin = async (req, res, next) => {
        const { access_token: accessToken } = req.query;
        if (!accessToken || !req.query.access_token || !accessToken === undefined) {
        return res.redirect("/");
        }

        try {
            const userExchanged = await this.exchangeToken(req.query.access_token);
            User.findOne({ email: userExchanged.email }, (err, user) => {
                if (!err) {
                    let token = jwt.sign({ user: user }, config.privateKey,
                    {
                        expiresIn: moment().add(14, "days").unix(),
                    });
                    res.redirect(`${config.clientSideUrl}oauth/login/user?access_token=${token}`);
                } else {
                    res.status(401).json({
                        error: err,
                        msg:"Error al obtener usuario o usuario no encontrado"
                    })
                }
            });
        } catch (error) {
            next(boom.badRequest(error));
        }
    };

    exchangeUserRegister = async (req, res, next) => {
        const { access_token: accessToken } = req.query;
        if (!accessToken || !req.query.access_token || !accessToken === undefined) {
        return res.redirect("/");
        }

        try {
            const userExchanged = await this.exchangeToken(req.query.access_token);
            let userInfo = UserConstructor(userExchanged, this.provider);
            let { error , value} = UserSchema.validate(userInfo);
            if (value) {
                User.findOne({ email: value.email }, (err, user) => {
                    if (!err) {
                        if (!user) {
                            User.create(value, (err, user) => {
                                if (!err) {
                                    let token = jwt.sign(
                                        { user: user },
                                        config.privateKey,
                                        {
                                            expiresIn: moment()
                                            .add(14, "days")
                                            .unix(),
                                        }
                                        );
                                    res.status(200).json({
                                        msg: "user created",
                                        token: token
                                    });
                                } else {
                                    res.status(401).json({
                                    error: err,
                                    msg: "Error al crear el usuario o usuario ya existente",
                                    });

                                }
                            });
                        } else {
                            res.status(401).json({
                                error: err,
                                msg:"Error al obtener usuario o usuario no encontrado"
                            })
                        }
                    } else {
                        res.status(401).json({
                            error: err,
                            msg:"Error al obtener usuario o usuario no encontrado"
                        })
                    }
                })

            }
        } catch (error) {
            next(boom.badRequest(error));
        }
    };

}

module.exports = OAuthService;