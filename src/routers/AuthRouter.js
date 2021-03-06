const {Router } = require('express');
const AuthService = require('../services/AuthService');
const OAuthService = require('../services/OAuthService');
const UserController = require('../controllers/UserController');
class AuthRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }

    #config() {
        const objAuth = new AuthService()
        const objOAuth = new OAuthService()
        const objUser = new UserController()

        this.router.get('/', (req, res) => {
            res.send('Hello World');
        });
        this.router.get('/user', objUser.getUser);
        this.router.post("/api/register", objAuth.register);
        this.router.post("/api/login", objAuth.login);
        this.router.post("/api/photo", objUser.addPhoto);
        this.router.get('/user/:photoname', objUser.getPhoto);
        this.router.get('/oauth/login/user', objOAuth.exchangeUserLogin);
        this.router.get('/oauth/register/user', objOAuth.exchangeUserRegister);

        //loginProvider
        this.router.get("/Oauth/github/:state", objOAuth.accessFromProvider);
        this.router.get("/Oauth/google/:state", objOAuth.accessFromProvider);
        this.router.get("/Oauth/twitter/:state", objOAuth.accessFromProvider);
        this.router.get("/Oauth/facebook/:state", objOAuth.accessFromProvider);
        //callbackProvider
        this.router.get("/auth/github/callback", objOAuth.callbackProvider);
        this.router.get("/auth/google/callback", objOAuth.callbackProvider);
        this.router.get("/auth/twitter/callback", objOAuth.callbackProvider);
        this.router.get("/auth/facebook/callback", objOAuth.callbackProvider);
        //updateUser
        this.router.put("/api/user/:id", objUser.updateUser);
        //deleteUser
        this.router.delete("/api/user/delete/:id", objUser.deleteUser);
    }
}

module.exports = AuthRouter;