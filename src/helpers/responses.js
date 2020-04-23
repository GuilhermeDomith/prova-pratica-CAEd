const { ErrorHandler } = require('./exceptions');

const success = (res, { description=undefined, data=undefined }) => {
    res.json({
        data,
        situacao: 'SUCESSO',
        description
    });
}

const error = (err, res) => {

    if(err instanceof ErrorHandler){
        err.validations.forEach(valid => {
            err.message += ` ${valid}`
        });
    }
    
    res.status(err.statusCode || 500).json({
        data: err.data,
        situacao: "ERRO",
        tipo: err.type,
        descricao: err.message
    });
}

module.exports = {
    success,
    error
}