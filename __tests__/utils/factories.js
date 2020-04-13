const faker = require('faker');
const { factory } = require('factory-girl');

const { StatusCorrection } = require ('../../src/model/status.model');
const { Correction } = require ('../../src/model/correction.model');
const { Key } = require ('../../src/model/key.model');
const { Option } = require ('../../src/model/option.model');

let counter = 0;
let counter2 = 0;

factory.define('Option', Option, () => ({
    valor: faker.random.number(),
    descricao: 'CERTO'
}))

factory.define('Key', Key, () => ({
    titulo: 'Titulo 1',
    opcoes: Array.from({length: 2}, (v, k) => factory.create('Option'))
}));

factory.define('Correction', Correction, () => ({
    item: faker.random.number,
    referencia: faker.random.number,
    sequencial: faker.random.number,
    solicitacao: faker.random.number,
    ordem: ++counter,
    chave:  Array.from({length: 2}, (v, k) => factory.create('Key'))
}));

module.exports = factory;