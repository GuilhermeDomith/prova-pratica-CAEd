const mongoose = require('mongoose');

class CustomSchema extends mongoose.Schema{

    constructor(definition, options){
        super(definition, options);

        this.set('versionKey', false);
        this.set('toJSON',{
            virtuals:true,
            transform: function (doc, ret, options) {
                delete ret._id;
            }
        });
    }
}


module.exports = CustomSchema;