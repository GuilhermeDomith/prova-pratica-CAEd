
const { Correction } = require('../model/correction.model');
const { Status } = require('../model/status.model');
const Key = require('../model/key.model');

class CorrectionsController{

    async getNextCorrection(req, res) {
        let correction = await Correction.findOne({ situacao: 0 }).sort({ ordem: 1 })
        console.log(correction)
        res.send({ data: correction });
    }

    async correct(req, res) {
        const { id } = req.params;
        let correction = await Correction.findById(id)
        
        correction.situacao = Status.CORRIGIDA;
        await correction.save();
        res.send(correction);
    }

    reserve(req, res) {}
    getAllReserved(req, res) {}
}

module.exports = new CorrectionsController();