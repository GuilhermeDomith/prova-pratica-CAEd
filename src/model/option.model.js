const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


const OptionSchema = new Schema({
    valor: { type: Number, required: false , unique: true},
    descricao:{ type: String, required: true, unique: true},
});

OptionSchema.plugin(AutoIncrement, {id: 'option_valor_seq', inc_field: 'valor'});
const Option = mongoose.model('Option', OptionSchema);

Option.createIndexes({ valor: 1 })
Option.createIndexes({ descricao: 1 })

module.exports = {
    Option,
}