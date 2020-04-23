const mongoose = require('mongoose');
const CorrectionItem = mongoose.model('CorrectionItem');
const Status = CorrectionItem.Status;

const invalidToStatus = {}
invalidToStatus[Status.CORRIGIDA] = 'Item inválido para correção.'; 
invalidToStatus[Status.RESERVADA] = 'Item inválido para ser reservado.'; 
invalidToStatus[Status.COM_DEFEITO] = 'Item inválido para ser marcado como com defeito.';

const CorrectionErrors = {
    IS_EMPTY: { 
        status: "SEM_CORRECAO", 
        defaultStatusCode: 200,
        message: 'Não existem mais correções disponíveis.' 
    },
    INCORRECT_KEY: { 
        status: "CHAVE_INCORRETA",
        defaultStatusCode: 400,
        message: 'Chave de correção incorreta.' 
    },
    ALREADY_CORRECTED: { 
        status: "ITEM_CORRIGIDO",
        defaultStatusCode: 400, 
        message: 'Item já corrigido.' 
    },
    INVALID_TO_STATUS: (status) => ({
        status: "ITEM_INVALIDO",
        defaultStatusCode: 400, 
        message: invalidToStatus[status]
    }),
    NOT_FOUND: {
        status: "ITEM_NAO_ENCONTRADO",
        defaultStatusCode: 404, 
        message: 'Correção não existe.' 
    }
}

module.exports = {
    CorrectionErrors,
}
