const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes');
const { error } = require('./helpers/responses');


class AppController{

    constructor(){
        this.express = express();
        
        this.middlewares();
        this.routes();
        this.handlerError();
    }
    
    middlewares() {
        this.express.use(cors());
        this.express.use(bodyParser.json());
    }

    routes() {
        this.express.use('/', routes);
    }

    handlerError(){
        this.express.use((err, req, res, next) => {
            error(err, res);
        });
    }
}

module.exports = new AppController().express;
