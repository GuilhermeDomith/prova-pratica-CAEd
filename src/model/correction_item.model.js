const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = require('./custom.schema');


const CorrectionItemSchema = new Schema({
    item: { type: String, required: true },
    referencia: { type: String,  required: true },
    sequencial: { type: String,  required: true },
    solicitacao: { type: String,  required: true },
    situacao: { type: Number , default: 0 },
    ordem: { type: Number, required: false, unique: true},
    chave: [ { type: Schema.Types.ObjectId, ref: 'Key' } ]
});


const CorrectionStatus = {
    DISPONIVEL: 0, 
    RESERVADA:  1,
    CORRIGIDA:  2,
    COM_DEFEITO: 4
}


const populateAll = async function () {
    await this.populate({ path: 'chave', model: 'Key' }).execPopulate();
    
    if(this.chave)
       await Promise.all( 
           this.chave.map( (key) => key.populateAll() )
       );

    return this;
}


const saveKeyAssociation = async function () {
    await this.populateAll();
    
    if(!this.chave) 
        return;

    this.chave = await this.chave.map(async key => {
        key._creator = this.id;
        return key.save();
    });
}


CorrectionItemSchema.methods = { 
    populateAll,
}

CorrectionItemSchema.statics = {
    Status: CorrectionStatus,
}

CorrectionItemSchema.post('save', saveKeyAssociation);
CorrectionItemSchema.plugin(AutoIncrement, {id: 'correction_ordem_seq', inc_field: 'ordem'});

const Correction = mongoose.model('CorrectionItem', CorrectionItemSchema);
Correction.createIndexes({ ordem: 1, situacao: 1 })

module.exports = Correction
