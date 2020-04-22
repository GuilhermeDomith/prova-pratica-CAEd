const mongoose = require('mongoose');
const faker = require('faker');
const { factory } = require('factory-girl');

const Correction = mongoose.model('CorrectionItem');
const Key = mongoose.model('Key');
const Question = mongoose.model('Question');
const Option = mongoose.model('Option');


const random = ({ min = 1, max = 100 }) => 
    faker.random.number({ min, max });


const selectRangeElements = (array, { min=2, max=2 }) => {
    let n_elem = random({ min, max });

    if(n_elem <= 0 || !array) return [];
    if(n_elem == 1) return [ faker.random.arrayElement(array) ];
    if(n_elem >= array.length) return array;

    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n_elem)
}


factory.define('Option', Option, () => ({
    descricao: factory.sequence('Option.desc', (n) => `description_${n}`)
}))


factory.define('Question', Question, (build) => ({
    titulo: faker.lorem.sentence,
    opcoes: selectRangeElements(build.options, { min: 2, max: 4 }),
}));


factory.define('Key', Key, (build) => ({  
    questao: faker.random.arrayElement(build.questions),
    valor: undefined,
}));


factory.define('CorrectionItem', Correction, () => ({
    item: faker.lorem.sentence,
    referencia: faker.lorem.sentence,
    sequencial: faker.lorem.sentence,
    solicitacao: faker.lorem.sentence,
    chave: undefined
}),{
    afterBuild: function (model, attrs, build){
        let numKeys = random({ max: 3 });

        return factory.createMany('Key', numKeys, {}, build)
            .then((keys) =>{ 
                model.chave = keys;
                return model;
            });
    }
});


module.exports = factory;