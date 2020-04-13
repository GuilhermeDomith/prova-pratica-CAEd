const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;


const Status = {
    DISPONIVEL: 0, 
    RESERVADA:  1,
    CORRIGIDA:  2,
    COM_DEFEITO: 4
}

const StatusCorrectionSchema = new Schema({
    _id: Number ,
    descricao:{ type: String, required: true },
});

const StatusCorrection = mongoose.model('StatusCorrection', StatusCorrectionSchema);

Object
    .keys(Status)
    .forEach(async (value, i) => {
        try{
            await new StatusCorrection({ _id: i, descricao: value}).save()
        }catch{};
    })

module.exports = {
    StatusCorrection,
    Status
}

/*StatusCorrection.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
StatusCorrection.set('toJSON', {
    virtuals: true
});*/

/*StatusCorrection.methods('toClient', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
});*/