const mongoose = require('mongoose');
const faker = require('faker');
const { factory } = require('factory-girl');

const Correction = mongoose.model('Correction');
const Key = mongoose.model('Key');
const Option = mongoose.model('Option');


factory.define('Option', Option, () => ({
    descricao: faker.random.number() + ''
}))


factory.define('Key', Key, () => ({
    titulo: 'Titulo 1',
    opcoes: factory.assocMany('Option', 2, '_id'),
}));


factory.define('Correction', Correction, () => ({
    item: faker.random.number,
    referencia: faker.random.number,
    sequencial: faker.random.number,
    solicitacao: faker.random.number,
    chave: factory.assocMany('Key', 2, '_id'),
}));

module.exports = factory;