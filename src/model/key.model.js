const mongoose = require('mongoose');
const Schema = require('./custom.schema');


const KeySchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'CorrectionItem' }, 
    questao: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    valor: { type: Schema.Types.ObjectId, ref: 'Option' },
});


const transformJSON = function (doc, ret, options) {
    delete ret._id;
    delete ret._creator;
    delete ret.questao;
}


const populateAll = async function () {
    await this.populate('questao').execPopulate();
    await this.questao.populateAll();
    return this;
}


KeySchema.methods = {
    populateAll,
}

KeySchema.virtual('opcoes').get(function () { 
    return this.questao && this.questao.opcoes });
KeySchema.virtual('titulo').get(function () {  
    return this.questao && this.questao.titulo });

KeySchema.set('toObject', { virtuals: true });
KeySchema.get('toJSON').transform = transformJSON;

const Key = mongoose.model('Key', KeySchema);

module.exports = {
    Key,
}