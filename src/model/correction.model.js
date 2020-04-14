const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

const { StatusCorrection, Status } = require('../model/status.model');
const { Key } = require('../model/key.model');

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

CorrectionSchema.post('save', async function(){
    await this.populate({ path: 'chave', model: 'Key' }).execPopulate();
    await this.populate({ path: 'chave.opcoes', model: 'Option' }).execPopulate();

    // salva a correcao atrelada a chave de correcao
    this.chave = await this.chave.map(async value => {
        value._creator = this.id; 
        return await Key.updateOne({ _id: value.id }, value);
    });
});


CorrectionSchema.statics = {
    getNextAvailable: () => {
        return Correction.findOne()
            .sort({ situacao: 1 , ordem: 1 })
            .exec();
    },

    changeStatusById: (id, status) => {
        return Correction.findById(id)
            .then((correction) => {
                correction.situacao = status;
                return correction.save();  
            })
    },

    listByStatus: (status) => {
        return Correction.find({ situacao: status })
            .sort({ ordem: 1 })
            .exec();
    },

    updateKeysById: (correctionId, keys) => {
        return Promise.all(
            keys.forEach((value) => {
                let key = Key.getKeyOfCorrection(value, correctionId);
                value.valor = key.valor;
            })
        );
    }
}


CorrectionSchema.methods = {
    toJSON:  function() {
        const obj = this.toObject();

        obj.id = obj._id;
        delete obj._id;
        return obj;
    }
};

CorrectionSchema.pre('save', function(next) {
    const obj = this.toObject();
  
    if (obj.situacao >= 0 
            && obj.situacao < Object.keys(Status).length)
        next();
    else next(new Error('Situacao Inválida'));  
});


const Correction = mongoose.model('Correction', CorrectionSchema);
Correction.createIndexes({ ordem: 1 })
Correction.createIndexes({ situacao: 1, ordem: 1 })


module.exports = {
    Correction,
}