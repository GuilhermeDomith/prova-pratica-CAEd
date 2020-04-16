const mongoose = require('mongoose');
const { success } = require('../helpers/responses');
const { ErrorHandler } = require('../helpers/exceptions');
const { messages } = require('../helpers/success_messages');
const { CorrectionErrors }  = require('../helpers/error_types');
const correctionService = require('../services/correction.service');

const Correction = mongoose.model('Correction');
const Key = mongoose.model('Key');


class CorrectionsController{

    async getNext(req, res, next){
        const allowReserved = req.query.reservada &&
            req.query.reservada.toLowerCase() == 'true';

        try{
            let correction = await correctionService.getNextAvailable(allowReserved);

            if(correction == null)
                throw new ErrorHandler(CorrectionErrors.IS_EMPTY, null, null);

            await correction.populateAll();
            success(res, correction, null);
        }catch(err){ 
            next(err); 
        }
    }

    async correct(req, res, next) {
        const { id } = req.params;
        const keys = req.body.chave || [];
        
        try{
            // valida se existe
            let correction = await Correction.findById(id);
            if(correction == null) 
                throw new ErrorHandler(CorrectionErrors.INVALID_ITEM, 404)

            await correctionService.saveKeysFromCorrection(correction, keys);
            await correctionService.changeStatusById(
                    correction.id, Correction.Status.CORRIGIDA);

            success(res, messages.ITEM_CORRECTED);
        }catch(err) { 
            next(err);
        }
    }

    async reserve(req, res, next) {
        const { id } = req.params;
        const keys = req.body.chave || [];

        try{
            // valida se existe
            let correction = await Correction.findById(id);
            if(correction == null) 
                throw new ErrorHandler(CorrectionErrors.INVALID_ITEM, 404)
            
            // valida se pode ser reservado
            let nextItem = await correctionService.getNextAvailable();
            if (nextItem == null || nextItem.id != id)
                throw new ErrorHandler(CorrectionErrors.INVALID_ITEM);

            await correctionService.saveKeysFromCorrection(correction, keys);
            await correctionService.changeStatusById(
                    correction.id, Correction.Status.RESERVADA);

            success(res, null, messages.ITEM_RESERVED);
        }catch(err) { 
            next(err); 
        }
    }

    async getAllReserved(req, res, next) {
        try{
            let corrections = await correctionService
                    .listByStatus(Correction.Status.RESERVADA);
            success(res, corrections, null);
        }catch(err) { 
            next(err); 
        }
    }
}

module.exports = new CorrectionsController();