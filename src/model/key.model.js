const mongoose = require('mongoose');
const Schema = require('./custom.schema');


const KeySchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'Correction'}, 
    titulo: { type: String, required: true },
    valor: { type: Schema.Types.ObjectId, ref: 'Option'},
    opcoes:[
        { type: Schema.Types.ObjectId, ref: 'Option' }
    ]
});

KeySchema.methods.populateAll = async function(doc) {
    await this.populate('opcoes').execPopulate();
    return this;
}

KeySchema.set('toJSON',{
    virtuals:true,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret._creator;
    }
});

const Key = mongoose.model('Key', KeySchema);

module.exports = {
    Key,
}