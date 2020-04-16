const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const KeySchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'Correction'}, 
    titulo: { type: String, required: true },
    valor: { type: Number, required: false},
    opcoes:[
        { type: Schema.Types.ObjectId, ref: 'Option' }
    ]
});

KeySchema.methods.toJSON = function() {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    
    return obj;
}

KeySchema.methods.populateAll = async function(doc) {
    await this.populate('opcoes').execPopulate();
    return this;
}


const Key = mongoose.model('Key', KeySchema);

module.exports = {
    Key,
}