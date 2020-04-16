const mongoose = require('mongoose');

const Correction = mongoose.model('Correction');
const Key = mongoose.model('Key');
const Option = mongoose.model('Option');

module.exports = {
    truncade: async () => {
        await Correction.counterReset('correction_ordem_seq'),
        await Option.counterReset('option_valor_seq')

        return Promise.all([
            Correction.deleteMany({}),
            Key.deleteMany({}),
            Option.deleteMany({}),
        ]).then(() => 
            console.log('Truncade has been executed.'));      
    },

    closeConnection: async () =>{ 
        return Promise.all(
               mongoose.connections.map(conn => 
                    new Promise(function(res, rej){
                        conn.close()
                        .then(res)
                        .catch(res)
                    })
                )
            );
    }
}
