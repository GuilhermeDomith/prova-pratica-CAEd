const { messages } = require('../helpers/success_messages');
const { CorrectionErrors }  = require('../helpers/error_types');
const { success } = require('../helpers/responses');

const { Correction } = require('../model/correction.model');
const { Status } = require('../model/status.model');
const { Key } = require('../model/key.model');
const { ErrorHandler } = require('../helpers/exceptions');


class CorrectionsController{

    getNextCorrection = async (req, res, next) => {
        const includeReserved = req.query.reservada || false;

        try{
            let correction = await Correction.getNextAvailable(includeReserved);

            if(correction == null)
                throw new ErrorHandler(CorrectionErrors.IS_EMPTY, 200, null);

            success(res, correction, null);
        }catch(err){ 
            next(err); 
        }
    }

    async correctItem(req, res, next) {
        const { id } = req.params;
        const { chave } = req.body;

        try{
            let correction = await Correction.getNextAvailable();

            if (correction.id !== id)
                throw new ErrorHandler(CorrectionErrors.INVALID_ITEM, 400);

            await Key.updateManyCorrectionKeyValue(chave, correction.id);
            await Correction.changeStatusById(id, Status.CORRIGIDA);

            success(res, messages.ITEM_CORRECTED);
        }catch(err) { 
            next(err);
        }
    }

    async reserveItem(req, res, next) {
        const { id } = req.params;

        try{
            let correction = await Correction.getNextAvailable();

            if (correction.id !== id)
                return res.status(400).send('This item cannot be reserved.')

            correction = await Correction.changeStatusById(id, Status.RESERVADA);
            success(res, null, messages.ITEM_RESERVED);
        }catch(err) { 
            next(err); 
        }
    }

    async getAllReserved(req, res, next) {
        try{
            let corrections = await Correction.listByStatus(Status.RESERVADA);
            success(res, corrections, null);
        }catch(err) { 
            next(err); 
        }
    }
}

module.exports = new CorrectionsController();