require('../../src/app');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');

const createMock = async () => {
    const options = await factory.createMany('Option', 10);
    const questions = await factory.createMany('Question', 10, {}, { options })
    await factory.createMany('CorrectionItem', 5, {}, { questions })
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
            console.error(err)
            console.log(`Mock hasn't been executed.\n`);
            return process.exit(1)
        }
    )
