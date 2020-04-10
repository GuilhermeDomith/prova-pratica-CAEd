const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/caed', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true  
});

module.exports = mongoose;