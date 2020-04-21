const mongoose = require('mongoose');
const { ErrorHandler } = require('../helpers/exceptions');
const { CorrectionErrors } = require('../helpers/error_types');

const Key = mongoose.model('Key');


class keyService{

    async findKeyWithOption(keyId, correctionId, optionValue){
        return await Key.findById(keyId)
            .populate({
                path: 'opcoes',
                match: { _id: optionValue }
                })
            .populate({
                path: '_creator',
                match: { _id: correctionId}
                })
            .exec();
    }


    async validateKeyValue(keyId, correctionId, optionValue){
        const key = await this.findKeyWithOption(keyId, correctionId, optionValue);

        if(key === null)
            throw new ErrorHandler(CorrectionErrors.INCORRECT_KEY)

        if(key._creator === null || key._creator._id != correctionId) 
            throw new ErrorHandler(CorrectionErrors.INCORRECT_KEY)

        if(key.opcoes.length === 0){ 
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