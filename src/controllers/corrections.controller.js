
const { Correction } = require('../model/correction.model');
const { Status } = require('../model/status.model');
const { Key } = require('../model/key.model');


class CorrectionsController{

    async getNextCorrection(req, res) {
        let correction = await Correction.getNextAvailable();
        res.send({ data: correction });
    }

    async correctItem(req, res, next) {
        const { id } = req.params;
        const { chave } = req.body;

        let correction = await Correction.getNextAvailable();

        if (correction.id !== id)
            return res.status(400).send('This item cannot be corrected.')

        await Key.updateManyCorrectionKeyValue(chave, correction.id);
        await Correction.changeStatusById(id, Status.RESERVADA);

        res.send(correction);
    }

    async reserveItem(req, res) {
        const { id } = req.params;
        let correction = await Correction.getNextAvailable();

        if (correction.id !== id)
            return res.status(400).send('This item cannot be reserved.')

        correction = await Correction.changeStatusById(id, Status.RESERVADA);
        res.send(correction);
    }

    async getAllReserved(req, res, next) {
        let correction = await Correction.listByStatus(Status.RESERVADA);
        res.send({ data: correction });
    }

    async test(req, res){
        const { id } = req.params;

        res.send(data);
    }
}

module.exports = new CorrectionsController();