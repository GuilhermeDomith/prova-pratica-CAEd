const app = require('../../src/app');
const mongoose = require('mongoose');
const request = require('supertest');
const faker = require('faker');

class CorrectionRequests{

    async getNext(reserved=false){
        return await request(app)
            .get(`/correcoes/proxima/?reservada=${reserved}`);
    }

    async correct(correction, fakeOptions=false, fakeKey=false){
        await correction.populateAll()
        let keysCorrect = []

        keysCorrect = selectOptionFromKey(correction.chave, fakeOptions, fakeKey);

        return request(app)
            .post(`/correcoes/${correction.id}`)
            .send({ chave: keysCorrect });
    }

    async reserve(correction, fakeOptions=false, fakeKey=false){
        await correction.populateAll()
        let keysCorrect = []

        keysCorrect = selectOptionFromKey(correction.chave, fakeOptions, fakeKey);

        return request(app)
            .post(`/correcoes/reservadas/${correction.id}`)
            .send({ chave: keysCorrect });
    }

    async listReserved(){
        return await request(app).get(`/correcoes/reservadas`);
    }

}

const selectOptionFromKey = (keys, fakeOptions=false, fakeKey=false) => {
    const keysCorrect = keys.map(
        (key) => {
            valor = (fakeOptions)?
                faker.random.number() :
                faker.random.arrayElement(key.opcoes)._id
            
            id = (fakeKey)?
                mongoose.Types.ObjectId() : 
                key.id
                
            return { id, valor }
        }
    );

    return keysCorrect
}

module.exports = new CorrectionRequests();