const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

const KeySchema = new Schema({
    titulo:{ type: String, required: true },
    opcoes:[
        { type: Schema.Types.ObjectId, ref: 'Option' }
    ]
});

const Key = mongoose.model('Key', KeySchema);

module.exports = {
    Key,
}