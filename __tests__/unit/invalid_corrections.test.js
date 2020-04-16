const requests = require('../requests/correction.requests');
const mongoose = require('mongoose');

const Correction =  mongoose.model('Correction');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');


describe('Invalid Corrections', () => {
    beforeAll(async (done) => {
        await dbUtils.truncade();
        
        this.corrections = await factory.createMany('Correction', 3)
        this.corrections = await Correction.find({}).sort({ ordem: 1})

        done();
    })

    it('Should not correct with invalid key', async (done) => {
        const first = this.corrections[0];

        const response = await requests.correct(first, false, true);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should not correct with invalid option', async (done) => {
        const first = this.corrections[0];
       
        const response = await requests.correct(first, true, false);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should not correct with missing key', async (done) => {
        const first = this.corrections[0];

        await first.populateAll()
        first.chave.pop();
        
        const response = await requests.correct(first);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should not reserve with invalid key', async (done) => {
        const first = this.corrections[0];

        const response = await requests.reserve(first, false, true);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should not reserve with invalid option', async (done) => {
        const first = this.corrections[0];
       
        const response = await requests.reserve(first, true, false);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should not reserve with missing key', async (done) => {
        const first = this.corrections[0];

        await first.populateAll()
        first.chave.pop();
        
        const response = await requests.reserve(first);
        expect(response.status).not.toBe(200);
        done()
    });

    afterAll(async (done) => {
        dbUtils.closeConnection().then(done)
    });

});