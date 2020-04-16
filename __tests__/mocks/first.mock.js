const app = require('../../src/app');
const mongoose = require('mongoose');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');

const createMock = () => {
    return factory.createMany('Correction', 10)
}

dbUtils.truncade()
    .then(createMock)
    .then(
        function(){
            console.log('Mock has been excuted.');
            return process.exit(0)
        }
    ).catch(
        function(err){
            console.log(`Mock hasn't been excuted.\n${err}`);
            return process.exit(1)
        }
    )
