const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

const KeySchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'Correction'}, 
    titulo: { type: String, required: true },
    valor: { type: Schema.Types.ObjectId, ref: 'Option', required: false, default: null },
    opcoes:[
        { type: Schema.Types.ObjectId, ref: 'Option' }
    ]
});

KeySchema.post('save', async function(){
    await this.populate({ path: 'opcoes', model: 'Option' }).execPopulate();
});

const autoPopulateKey = async function(next) {
    this.populate({ path: 'opcoes', model: 'Option' });
    next();
};
  
KeySchema
    .pre('findOne', autoPopulateKey)
    .pre('find', autoPopulateKey);

KeySchema.statics = {

    findKeyWithOption: async (keyId, correctionId, optionValue) => {
        return Key.findById(keyId)
           .populate({
               path: 'opcoes',
               match: { valor: optionValue }
            })
           .populate({
               path: '_creator',
               match: { _id: correctionId}
            })
           .exec();
    },

    validateKeyWithOption: async (keyId, correctionId, optionValue) => {
        const key = await Key.findKeyWithOption(keyId, correctionId, optionValue);

        if(key === null) throw Error(`Chave de correção incorreta`)
        if(key._creator === null) throw Error(`Chave de correção incorreta`)
        if(key.opcoes.length === 0) throw Error(`Valor '${optionValue}' não é válido para o item ${keyId}`)

        return key;
    },

    updateManyCorrectionKeyValue: async (keys, correctionId) => {        
        const validatedKeys = await Promise.all(
            keys.map( key => 
                Key.validateKeyWithOption(key.id, correctionId, key.valor))
        )
        
        return await Promise.all(
            validatedKeys.map( key => key.save())
        );
    }
}

const Key = mongoose.model('Key', KeySchema);

module.exports = {
    Key,
}