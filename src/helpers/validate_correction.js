const mongoose = require('mongoose');
const { ErrorHandler } = require('../helpers/exceptions');
const { CorrectionErrors }  = require('../helpers/error_types');

const CorrectionItem = mongoose.model('CorrectionItem')
const Key = mongoose.model('Key')
const Status = CorrectionItem.Status;


class ValidateCorrection{

    constructor (itemId, keyValues, toStatus){

        this.keyValues = (keyValues instanceof Array)? keyValues : [];
        this.itemId = itemId;
        this.toStatus = toStatus;

        this.validations = [];
        this.isValidKeys = false;
        this.isValidStatus = false;
        this.ErrorStatus = CorrectionErrors.INVALID_ITEM_TO_CORRECT;

    }


    async validateKeyValue ({ id, valor }){
        let key = await Key.findKey(id, this.itemId);

        if(key == null){
            let errorMessage = `Chave '${id}' não é válida para esta correção.`
            this.validations.push(errorMessage);
            return false;
        }

        if(key.opcoes == null || !key.opcoes.includes(valor)){ 
            let errorMessage = `Valor '${valor}' não é válido para o item ${id}.`
            this.validations.push(errorMessage);
            return false;
        }

        return true;
    }


    async canChangeStatus () {
        if( !this.Item ||
            !this.Item instanceof CorrectionItem) 
            return false;

        switch ( this.toStatus ){
            case Status.RESERVADA:

                if(this.Item.situacao == Status.DISPONIVEL)
                   return await this.Item.isTheNextCorrection();
                else return false;

            case Status.CORRIGIDA:
            case Status.COM_DEFEITO:

                if(this.Item.situacao == Status.RESERVADA)
                    return true;
                
                if(this.Item.situacao == Status.DISPONIVEL)
                    return await this.Item.isTheNextCorrection();    
                else return false;

            default: return false
        }
    }


    async validateManyKeys (){
        if(this.Item == null) return false;

        let isValidKeys = await Promise.all( 
            this.keyValues.map( async Key => {
                return this.validateKeyValue(Key)
            })
        );

        return ! isValidKeys.includes(false) 
             &&  isValidKeys.length != 0;
    }


    async validateNumberOfKeys (){
        try {
            
            this.Item = await CorrectionItem.findById(this.itemId);
            if(this.Item == null) return false;

            let numKeys = this.Item.chave.length;
    
            if(this.keyValues.length != numKeys) {
                let errorMessage = `Número de chaves não correspondem.`
                this.validations.push(errorMessage);
                return false;
            }

            return true;

        } catch {
            return false;
        }
    }


    async validate (){
        let validQtyKeys = await this.validateNumberOfKeys();
        let validKeyValues = await this.validateManyKeys();

        if(validKeyValues && validQtyKeys)
            this.isValidKeys = true;

        this.isValidStatus = await this.canChangeStatus(Status.CORRIGIDA);

        await this.checkValidate();
        return this;
    }


    async checkValidate () {
        
        if(this.Item == null)
            throw new ErrorHandler(CorrectionErrors.NOT_FOUND)

        if(this.Item.situacao == Status.CORRIGIDA)
            throw new ErrorHandler(CorrectionErrors.ALREADY_CORRECTED);

        if( !  this.isValidStatus )
            throw new ErrorHandler(CorrectionErrors.INVALID_TO_STATUS(this.toStatus));

        if( ! this.isValidKeys && this.toStatus != Status.COM_DEFEITO)
            throw new ErrorHandler(
                CorrectionErrors.INCORRECT_KEY, undefined, this.validations );
    }

}

module.exports = ValidateCorrection;