const app = require('../../src/app');
const mongoose = require('mongoose');
const request = require('supertest');
const faker = require('faker');

class CorrectionRequests{

    async getNext(reserved=false){
        return await request(app)
            .get(`/correcoes/proxima/?reservada=${reserved}`);
    }

    async correct(correction, fakeOptions=false, fakeKey=false, fakeItem=false){
        //await correction.populateAll()
        let keysCorrect = []

        keysCorrect = selectOptionFromKey(correction.chave, fakeOptions, fakeKey);

        let itemId = fakeItem?
            mongoose.Types.ObjectId()
            : correction.id;

        return request(app)
            .post(`/correcoes/${itemId}`)
            .send({ chave: keysCorrect });
    }

    async reserve(correction, fakeOptions=false, fakeKey=false, fakeItem=false){
        //await correction.populateAll()
        let keysCorrect = []

        keysCorrect = selectOptionFromKey(correction.chave, fakeOptions, fakeKey);

        let itemId = fakeItem?
            mongoose.Types.ObjectId()
            : correction.id;

        return request(app)
            .post(`/correcoes/reservadas/${itemId}`)
            .send({ chave: keysCorrect });
    }

    async marckAsBrocked(correction){
        return request(app)
            .post(`/correcoes/defeituosas/${correction.id}`)
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