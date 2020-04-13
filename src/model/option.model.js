const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    valor: { type: String, required: true },
    descricao:{ type: String, required: true },
});

const Option = mongoose.model('Option', OptionSchema);

module.exports = {
    Option,
}