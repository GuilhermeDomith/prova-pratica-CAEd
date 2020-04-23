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


const isTheNextCorrection = async function () {
    let nextItem = await CorrectionItem.getNextAvailable();
    
    if(!nextItem) return false;
    return nextItem.id === this.id;
}


const postSaveCorrectionItem = async function () {
    await this.populateAll();
    
    if(!this.chave) 
        return;

    this.chave = await this.chave.map(async key => {
        key._creator = this.id;
        return key.save();
    });
}

const getNextAvailable = async function (reserved=false) {
    let find_status = (reserved)? 
        [this.Status.RESERVADA] : [] 

    find_status.push(this.Status.DISPONIVEL);

    return await this
        .findOne({ situacao: { $in: find_status } })
        .sort({ ordem: 1, situacao: 1 })
        .exec();
}


const listByStatus = async function (status, { populateAll=false }) {
    let list = await this.find({ situacao: status })
                .sort({ ordem: 1 })
                .exec();

    if( !populateAll ) return list;
    
    return await Promise.all( list.map( elem => 
                elem.populateAll()
    ));
}


const updateStatusById = async function (id, status) {
    return await this.updateOne(
            { _id: id },
            { $set: { situacao: status } }
        );
}


CorrectionItemSchema.methods = { 
    populateAll,
    isTheNextCorrection
}

CorrectionItemSchema.statics = {
    Status: CorrectionStatus,
    getNextAvailable,
    listByStatus,
    updateStatusById
}

CorrectionItemSchema.post('save', postSaveCorrectionItem);
CorrectionItemSchema.plugin(AutoIncrement, {id: 'correction_ordem_seq', inc_field: 'ordem'});

const CorrectionItem = mongoose.model('CorrectionItem', CorrectionItemSchema);
CorrectionItem.createIndexes({ ordem: 1, situacao: 1 })

module.exports = CorrectionItem
