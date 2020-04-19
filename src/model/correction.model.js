const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = require('./custom.schema');

const CorrectionSchema = new Schema({
    item: { type: String, required: true },
    referencia: { type: String,  required: true },
    sequencial: { type: String,  required: true },
    solicitacao: { type: String,  required: true },
    situacao: { type: Number , default: 0 },
    ordem: { type: Number, required: false, unique: true},
    chave: [
        { type: Schema.Types.ObjectId, ref: 'Key' }
    ]
});


const saveKeyAssociation = async function(){
    await this.populate({ path: 'chave', model: 'Key' }).execPopulate();
    await this.populate({ path: 'chave.opcoes', model: 'Option' }).execPopulate();

    // salva o id da correcao nas suas chaves.
    this.chave = await this.chave.map(async key => {
        key._creator = this.id;
        return key.save()
    });
}

CorrectionSchema
    .post('save', saveKeyAssociation);

CorrectionSchema.statics.Status = {
    DISPONIVEL: 0, 
    RESERVADA:  1,
    CORRIGIDA:  2,
    COM_DEFEITO: 4
}

CorrectionSchema.methods.populateAll = async function(){
    await this.populate({ path: 'chave', model: 'Key' }).execPopulate();
    await this.populate({ path: 'chave.opcoes', model: 'Option' }).execPopulate();
    return this;
}

CorrectionSchema.plugin(AutoIncrement, {id: 'correction_ordem_seq', inc_field: 'ordem'});
const Correction = mongoose.model('Correction', CorrectionSchema);

Correction.createIndexes({ ordem: 1, situacao: 1 })

module.exports = Correction
