const requests = require('../requests/correction.requests');
const mongoose = require('mongoose');

const Correction =  mongoose.model('CorrectionItem');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');


describe('Invalid Corrections', () => {
    beforeAll(async (done) => {
        await dbUtils.truncade();
        
        const options = await factory.createMany('Option', 10);
        const questions = await factory.createMany('Question', 10, {}, { options })
        await factory.createMany('CorrectionItem', 3, {}, { questions })

        done();
    })

    it('Should not correct with invalid key', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data
    
        const response = await requests.correct(correction, false, true);
        const { body } = response;

        expect(body.tipo).toBe('CHAVE_INCORRETA')
        expect(response.status).toBe(400);
        done()
    });

    it('Should not correct with invalid option', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data
       
        const response = await requests.correct(correction, true, false);
        const { body } = response;

        expect(body.tipo).toBe('CHAVE_INCORRETA')
        expect(response.status).toBe(400);
        done()
    });

    it('Should not correct with missing key', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data

        correction.chave.pop();
        
        const response = await requests.correct(correction);
        const { body } = response;

        expect(body.tipo).toBe('CHAVE_INCORRETA')
        expect(response.status).toBe(400);
        done()
    });

    it('Should not reserve with invalid key', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data

        const response = await requests.reserve(correction, false, true);
        const { body } = response;

        expect(body.tipo).toBe('CHAVE_INCORRETA')
        expect(response.status).toBe(400);
        done()
    });

    it('Should not reserve with invalid option', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data
       
        const response = await requests.reserve(correction, true, false);
        const { body } = response;

        expect(body.tipo).toBe('CHAVE_INCORRETA')
        expect(response.status).toBe(400);
        done()
    });

    it('Should not reserve with missing key', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data

        correction.chave.pop();
        
        const response = await requests.reserve(correction);
        const { body } = response;

        expect(body.tipo).toBe('CHAVE_INCORRETA')
        expect(response.status).toBe(400);
        done()
    });

    it('Should not correct inexistent item', async (done) => {
        const resp = await requests.getNext(false);
        const correction = resp.body.data

        const response = await requests.correct(correction, false, false, true);
        const { body } = response;

        expect(body.tipo).toBe('ITEM_NAO_ENCONTRADO')
        expect(response.status).toBe(404);
        done()
    });

    afterAll(async (done) => {
        dbUtils.closeConnection().then(done)
    });

});