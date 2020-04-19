const mongoose = require('mongoose');
const Schema = require('./custom.schema');

const OptionSchema = new Schema({
    descricao:{ type: String, required: true, unique: true},
}, {
    id: false
});

OptionSchema.virtual('valor').get(function() { return this._id; });
const Option = mongoose.model('Option', OptionSchema);

Option.createIndexes({ descricao: 1 })

module.exports = {
    Option,
}