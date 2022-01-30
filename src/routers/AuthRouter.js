const {Router } = require('express');
const UserController = require('../controllers/UserController');


class AuthRouter {
    constructor() {
        this.router = Router();
        this.#config();
    }

    #config() {
        const objUser = new UserController()
        this.router.post('/login',  objUser.login);
        this.router.post('/register' , objUser.register );
    }
}

module.exports = AuthRouter;