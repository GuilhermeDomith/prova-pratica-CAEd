const mongoose = require('mongoose');
const keyService = require('../services/key.service');
const { ErrorHandler } = require('../helpers/exceptions');
const { CorrectionErrors } = require('../helpers/error_types');

const Correction = mongoose.model('CorrectionItem');
const Status = Correction.Status;
const Errors = CorrectionErrors;


class CorrectionService{

    async getNextAvailable(reserved=false){
        let find_status = (reserved)? 
            [Status.RESERVADA] : [] 

        find_status.push(Status.DISPONIVEL);

        return await Correction
            .findOne({ situacao: {$in: find_status}})
            .sort({ ordem: 1, situacao: 1 })
            .populate({ path: 'chave', model: 'Key' })
            .populate({ path: 'chave.opcoes', model: 'Option' })
            .exec();
    }


    async changeStatusById(id, status){
        return await Correction.updateOne(
                {_id: id},
                {$set: {situacao: status}}
            );
    }


    async listByStatus(status){
        return await Correction
            .find({ situacao: status })
            .sort({ ordem: 1 })
            .exec();
    }


    async saveKeysFromCorrection(correction, keys){
        await correction.populateAll();

        await this.validateCorrection(correction)
        await keyService.validateManyKeys(keys, correction)
        await keyService.updateMany(keys)
    }


    async validateCorrection(correction){

        if(correction == null)
            throw new ErrorHandler(Errors.INVALID_ITEM);

        switch(correction.situacao){
            case null:
            case undefined:
            case Status.COM_DEFEITO:
                throw new ErrorHandler(Errors.INVALID_ITEM);  

            case Status.CORRIGIDA:
                throw new ErrorHandler(Errors.ALREADY_CORRECTED);

            case Status.DISPONIVEL: 
                let nextItem = await this.getNextAvailable();

                if(nextItem.id === correction.id) 
                    break;

                throw new ErrorHandler(Errors.INVALID_ITEM);
        }

        return correction;
    }
}

module.exports = new CorrectionService();