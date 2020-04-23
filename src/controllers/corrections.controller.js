const mongoose = require('mongoose');

const ValidateCorrection = require('../helpers/validate_correction');
const { success } = require('../helpers/responses');
const { ErrorHandler } = require('../helpers/exceptions');
const { messages } = require('../helpers/success_messages');
const { CorrectionErrors }  = require('../helpers/error_types');

const Correction = mongoose.model('CorrectionItem');
const Key = mongoose.model('Key');
const Status = Correction.Status;


class CorrectionsController{

    async getNext(req, res, next){
        const allowReserved = req.query.reservada &&
            req.query.reservada.toLowerCase() == 'true';

        try{
            let correction = await Correction.getNextAvailable(allowReserved);

            if(correction == null)
                throw new ErrorHandler(CorrectionErrors.IS_EMPTY, undefined, null);

            await correction.populateAll();
            success(res, correction);
        }catch(err){ 
            next(err); 
        }
    }

    async correct(req, res, next) {
        const { id } = req.params;
        const keys = req.body.chave || [];
        
        try{

            let validator = new ValidateCorrection(id, keys, Status.CORRIGIDA)
            await validator.validate();

            await Key.updateManyValues(keys)
            await Correction.updateStatusById(id, Status.CORRIGIDA);

            success(res, undefined, messages.ITEM_CORRECTED);
        }catch(err) { 
            next(err);
        }
    }

    async reserve(req, res, next) {
        const { id } = req.params;
        const keys = req.body.chave || [];

        try{

            let validator = new ValidateCorrection(id, keys,  Status.RESERVADA)
            await validator.validate();

            await Key.updateManyValues(keys)
            await Correction.updateStatusById(id,  Status.RESERVADA);

            success(res, undefined, messages.ITEM_RESERVED);
        }catch(err) { 
            next(err); 
        }
    }

    async markAsBrocked(req, res, next) {
        const { id } = req.params;

        try{

            let validator = new ValidateCorrection(id, [],  Status.COM_DEFEITO)
            await validator.validate();

            await Correction.updateStatusById(id, Status.COM_DEFEITO);
            success(res, undefined, messages.ITEM_MARKED_BROCKED);
        }catch(err) { 
            next(err); 
        }
    }

    async getAllReserved(req, res, next) {
        try{
            let corrections = await Correction
                .listByStatus(Status.RESERVADA, { populateAll: true});

            success(res, corrections, null);
        }catch(err) { 
            next(err); 
        }
    }
}

module.exports = new CorrectionsController();