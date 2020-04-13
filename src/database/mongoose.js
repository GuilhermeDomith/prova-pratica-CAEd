require('../config/env.config');
const mongoose = require('mongoose');

class DataBaseConnection{

    constructor(){
        this.mongoose = mongoose;
        this.URI = this.buildConnectionURI();

        this.mongoose.Promise = global.Promise;
        this.mongoose.connection.on('connected', this.onConnected);
        this.mongoose.connection.on('disconnected', this.onDisconnected);
        this.mongoose.connection.on('error', this.onError);
    }

    buildConnectionURI() {
        this.db_host = process.env.DB_HOST;
        this.db_name = process.env.DB_NAME;
        this.db_user = process.env.DB_USER;
        this.db_password = process.env.DB_PASSWORD;

        let auth = "";
        if(this.db_user && this.db_password)
            auth = `${this.db_user}:${this.db_password}@`;

        return `mongodb://${auth}${this.db_host}/${this.db_name}`;
    }

    connect(){
        this.mongoose.connect(this.URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true  
        });

        return this.mongoose;
    }

    onConnected = () =>
        console.log(`Database '${this.db_name}' is connected`);
    
    onError = (error) =>
        console.log(`Database '${this.db_name}' connection error: ${error}`);
    
    onDisconnected = () =>
        console.log(`Database '${this.db_name}' is disconnected`);

}

module.exports = new DataBaseConnection().connect();