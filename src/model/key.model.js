const mongoose = require('mongoose');
const Schema = require('./custom.schema');


const KeySchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: 'CorrectionItem' }, 
    titulo: { type: String, required: true },
    valor: { type: Schema.Types.ObjectId, ref: 'Option' },
    opcoes:[ { type: Schema.Types.ObjectId, ref: 'Option' } ]
});


const transformJSON = function (doc, ret, options) {
    options._parentOptions.transform(doc, ret, options)
    delete ret._creator;
}


const populateAll = async function () {
    await this.populate('opcoes').execPopulate();
    return this;
}


KeySchema.set('populateAll', populateAll);
KeySchema.get('toJSON').transform = transformJSON;
const Key = mongoose.model('Key', KeySchema);

module.exports = {
    Key,
}