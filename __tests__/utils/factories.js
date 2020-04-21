const mongoose = require('mongoose');
const faker = require('faker');
const { factory } = require('factory-girl');

const Correction = mongoose.model('CorrectionItem');
const Key = mongoose.model('Key');
const Option = mongoose.model('Option');

const max_elem = (n) => faker.random.number(n)+1;


factory.define('Option', Option, () => ({
    descricao: factory.sequence('Option.id', (n) => `description_${n}`)
}))


factory.define('Key', Key, () => ({
    titulo: faker.lorem.sentence,
    opcoes: factory.assocMany('Option', max_elem(3), '_id'),
}));


factory.define('CorrectionItem', Correction, () => ({
    item: faker.lorem.sentence,
    referencia: faker.lorem.sentence,
    sequencial: faker.lorem.sentence,
    solicitacao: faker.lorem.sentence,
    chave: factory.assocMany('Key', max_elem(2) , '_id'),
}));


module.exports = factory;