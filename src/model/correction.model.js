const mongoose = require('../database/mongoose');

const CorrectionSchema = new mongoose.Schema({
    item:{
        type: String,
        required: true
    },
    referencia:{
        type: String,
        required: true
    },
});

const Correction = mongoose.model('Correction', CorrectionSchema);
module.exports = Correction;