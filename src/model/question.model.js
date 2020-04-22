const mongoose = require('mongoose');
const Schema = require('./custom.schema');


const QuestionSchema = new Schema({
    titulo: { type: String, required: true },
    opcoes:[ { type: Schema.Types.ObjectId, ref: 'Option' } ]
});


const populateAll = async function () {
    await this.populate('opcoes').execPopulate();
    return this;
}

QuestionSchema.methods = {
    populateAll,
}

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {
    Question,
}