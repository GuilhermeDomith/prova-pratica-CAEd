const mongoose = require('../../src/database/mongoose');
const { StatusCorrection } = require('../../src/model/status.model');
const { Correction} = require('../../src/model/correction.model');
const { Key } = require('../../src/model/key.model');
const { Option } = require('../../src/model/option.model');

module.exports = {
    truncade: async () => {
        return Promise.all([
            Correction.deleteMany({}),
            Key.deleteMany({}),
            Option.deleteMany({}),
        ]).then(() => 
            console.log('Truncade has been executed.'));
    }
}
