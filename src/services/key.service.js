const mongoose = require('mongoose');
const { ErrorHandler } = require('../helpers/exceptions');
const { CorrectionErrors } = require('../helpers/error_types');

const Key = mongoose.model('Key');


class keyService{

    async findKeyWithOption(keyId, correctionId){

        let key = await Key.findOne({ _id: keyId })
            .where('_creator').equals(correctionId)
            .populate('questao')
            .exec();

        return key;
    }


    async validateKeyValue(keyId, correctionId, optionValue){
        const key = await this.findKeyWithOption(keyId, correctionId);
        
        if(key == null)
            throw new ErrorHandler(CorrectionErrors.INCORRECT_KEY)

        if(key.opcoes == null || !key.opcoes.includes(optionValue)){ 
            let validations = [`Valor '${optionValue}' não é válido para o item ${keyId}`]
            throw new ErrorHandler(
                CorrectionErrors.INCORRECT_KEY, null, null, validations)
        }

        return key;
    }


    async validateManyKeys(keys, correction){
        if(!Array.isArray(keys) || keys.length === 0)
            throw new ErrorHandler(CorrectionErrors.INCORRECT_KEY);

        if(correction.chave.length != keys.length) 
            throw new ErrorHandler(CorrectionErrors.INCORRECT_KEY)

        return await Promise.all(
            keys.map( key => 
                this.validateKeyValue(key.id, correction.id, key.valor))
        )
    }
    

    async updateMany(keys){
        return await Promise.all(
            keys.map(key =>
                Key.updateOne({_id: key.id}, {$set: {valor: key.valor}})
            ));
    }
}

module.exports = new keyService();