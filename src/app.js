const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes/routes.js');

class AppController{

    constructor(){
        this.express = express();
        
        this.middlewares();
        this.routes();
    }
    
    middlewares() {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        /*this.express.use((err, req, res, next) => {
            console.log(err.name)
            console.log(err.message)
            res.send({naosei: 2131})
            next(err)
        })*/
    }

    routes() {
        this.express.use('/', routes);
    }
}

module.exports = new AppController().express;
