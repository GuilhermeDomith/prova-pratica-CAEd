require('../../src/app');
//const mongoose = require('mongoose');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');

const createMock = () => {
    return factory.createMany('CorrectionItem', 10)
}

dbUtils.truncade()
    .then(createMock)
    .then(
        function(){
            console.log('Mock has been executed.');
            return process.exit(0)
        }
    ).catch(
        function(err){
            console.log(`Mock hasn't been executed.\n${err}`);
            return process.exit(1)
        }
    )
