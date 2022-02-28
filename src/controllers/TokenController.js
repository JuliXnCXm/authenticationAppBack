const { config } = require('../config/config');
const jwt = require('jsonwebtoken');

class TokenController {
    constructor(){
        this.verifyToken = this.verifyToken.bind(this);
    }

    verifyToken(req, res, next) {
        let token = this.getToken(req);
        let decode = jwt.verify(token, config.privateKey);
        if (decode.user != null) {
            res.status(200).send({
                message: "Token valido",
                user: decode.user
            })
        } else {
            res.status(401).send({
                message: 'Token is not valid'
            })
        }
    }

    getToken(req, res, next) {
        let token = null
        // let authorization = req.headers.authorization;
        let authorization = req.query.token;
        // if(authorization && authorization.split(' ')[0] === 'Bearer') {
        //     token = authorization.split(' ')[1];
        // }
        if(authorization) {
            token = authorization;
        }
        return token;
    }

}

module.exports = TokenController;