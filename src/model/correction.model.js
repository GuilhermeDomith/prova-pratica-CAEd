const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

const { StatusCorrection } = require('../model/status.model');


const CorrectionSchema = new Schema({
    item: { type: String, required: true },
    referencia: { type: String,  required: true },
    sequencial: { type: String,  required: true },
    solicitacao: { type: String,  required: true },
    situacao: { type: Number , ref: 'StatusCorrection', default: 0 },
    ordem: { type: Number, required: true},
    chave: [
        { type: Schema.Types.ObjectId, ref: 'Key' }
    ]
});

CorrectionSchema.methods.toJSON = function() {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    return obj;
};

const Correction = mongoose.model('Correction', CorrectionSchema);
Correction.createIndexes({ ordem: 1 })

module.exports = {
    Correction,
}