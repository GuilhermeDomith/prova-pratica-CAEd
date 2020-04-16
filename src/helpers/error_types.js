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
    INVALID_ITEM: {
        status: "ITEM_INVALIDO",
        defaultStatusCode: 400, 
        message: 'Item inválido para correção.' 
    }
}

module.exports = {
    CorrectionErrors,
}
