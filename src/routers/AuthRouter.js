const {Router } = require('express');
const UserController = require('../controllers/UserController');


class AuthRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }

    #config() {
        const objUser = new UserController()
        this.router.post('/api/register' , objUser.register);
        this.router.post('/api/login' , objUser.login);
        this.router.get('/', (req, res) => {
            res.send('Hello World');
        });
        this.router.get('/user', objUser.getThirdUser);
        //loginProvider
        this.router.get('/login/github', objUser.loginFromProvider);
        this.router.get('/login/google', objUser.loginFromProvider);
        this.router.get('/login/twitter', objUser.loginFromProvider);
        this.router.get('/login/facebook', objUser.loginFromProvider);
        //callbackProvider
        this.router.get('/auth/github/callback',objUser.callbackProvider);
        this.router.get("/auth/google/callback",  objUser.callbackProvider);
        this.router.get('/auth/twitter/callback', objUser.callbackProvider);
        this.router.get('/auth/facebook/callback', objUser.callbackProvider);
    }
}

module.exports = AuthRouter;