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


const findKey = async function (id, itemId) {
    try{
        let key = await this.findOne({ _id: id })
                .where('_creator').equals(itemId)
                .populate('questao')
                .exec();
        return key;
    }catch{
        return null;
    }
}


const updateManyValues = async function (keys) {
    return await Promise.all(
        keys.map(key =>
            Key.updateOne(
                {_id: key.id}, 
                {$set: {valor: key.valor}})
        ));
}


KeySchema.methods = {
    populateAll,
}

KeySchema.statics = {
    findKey,
    updateManyValues
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