const mongoose = require('mongoose');

class CustomSchema extends mongoose.Schema{

    constructor(definition, options){
        super(definition, options);

        let toJSONOptions = {
            virtuals:true,
            transform: function (doc, ret, options) {    
                delete ret._id;
            }
        }

        this.set('versionKey', false);
        this.set('toJSON', toJSONOptions);
    }

}


module.exports = CustomSchema;