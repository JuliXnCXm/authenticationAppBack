const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require("path");
const cookieParser = require("cookie-parser");

//imports
const { config } = require('./config/config');
const connDB = require("./database/Conndb");
const AuthRouter = require('./routers/AuthRouter');

class Server {
    constructor() {
        this.objConn = new connDB();
        this.app = express();
        this.#config();
    }

    #config() {

        //importing middlewares
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(cookieParser());
        //creating routes
        const authR = new AuthRouter();
        //mounting routes
        this.app.use('/', authR.router);
        //listening to port
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        })
    }
}

new Server();