const success = (res, data, description) => {
    res.json({
        data,
        situacao: 'SUCESSO',
        descricao: description
    });
}

const error = (err, res) => {
    const { statusCode, type, message, data } = err;
    
    res.status(statusCode || 500).json({
        data: data,
        situacao: "ERRO",
        tipo: type,
        descricao: message
    });
}

module.exports = {
    success,
    error
}