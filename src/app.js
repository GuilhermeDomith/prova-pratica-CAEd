require('./config/env.config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const database = require('./config/db.config');
const { error } = require('./helpers/responses');


class AppController{

    constructor(){
        this.express = express();
        
        this.configureDatabase();
        this.middlewares();
        this.routes();
        this.handlerError();
    }
    
    middlewares() {
        this.express.use(cors());
        this.express.use(bodyParser.json());
    }

    routes() {
        this.express.use('/', require('./routes'));
    }

    handlerError(){
        this.express.use((err, req, res, next) => {
            error(err, res);
        });
    }

    configureDatabase(){
        database.connect();
        require('./model/option.model')
        require('./model/key.model')
        require('./model/correction_item.model')
    }
}

module.exports = new AppController().express;
