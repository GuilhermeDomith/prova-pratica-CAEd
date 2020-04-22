const mongoose = require('mongoose');
const Schema = require('./custom.schema');

const OptionSchema = new Schema({
    descricao:{ type: String, required: true, unique: true},
}, {
    id: false,
    toJSON: { virtuals: true } 
});


OptionSchema.virtual('valor').get(function () { return this._id });
OptionSchema.set('toObject', { virtuals: true })
const Option = mongoose.model('Option', OptionSchema);

Option.createIndexes({ descricao: 1 })

module.exports = {
    Option,
}