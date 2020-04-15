const CorrectionErrors = {
    IS_EMPTY: { 
        status: "SEM_CORRECAO", 
        message: 'Não existem mais correções disponíveis' 
    },
    INCORRECT_KEY: { 
        status: "CHAVE_INCORRETA",
        message: 'Chave de correção incorreta' 
    },
    ALREADY_CORRECTED: { 
        status: "ITEM_CORRIGIDO", 
        message: 'Item já corrigido' 
    },
    INVALID_ITEM: {
        status: "ITEM_INVALIDO", 
        message: 'Item inválido para correção' 
    }
}

module.exports = {
    CorrectionErrors,
}
