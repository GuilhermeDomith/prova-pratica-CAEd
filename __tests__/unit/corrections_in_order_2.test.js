const requests = require('../requests/correction.requests');
const mongoose = require('mongoose');

const Correction =  mongoose.model('CorrectionItem');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');
const Status = Correction.Status;


describe('Second Order for Corrections', () => {

    beforeAll(async (done) => {
        await dbUtils.truncade();
        
        const options = await factory.createMany('Option', 10);
        const questions = await factory.createMany('Question', 10, {}, { options })
        await factory.createMany('CorrectionItem', 4, {}, { questions })

        this.corrections = await Correction.find({}).sort({ ordem: 1});

        done();
    })

    it('Should reserve the first item', async (done) => {
        const first = this.corrections[0];
        await first.populateAll()

        const response = await requests.reserve(first);
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });
    

    it('Should not reserve the third item', async (done) => {
        const third = this.corrections[2];
        await third.populateAll()

        const response = await requests.reserve(third);
        const { situacao, tipo } = response.body;

        expect(situacao).toBe('ERRO');
        expect(tipo).toBe('ITEM_INVALIDO');
        expect(response.status).toBe(400);
        done()
    });

    it('Should not mark the third item as brocked', async (done) => {
        const third = this.corrections[2];

        const response = await requests.marckAsBrocked(third);
        const { situacao, tipo } = response.body;

        expect(situacao).toBe('ERRO');
        expect(tipo).toBe('ITEM_INVALIDO');
        expect(response.status).toBe(400);
        done()
    });

    it('Should reserve the second item', async (done) => {
        const second = this.corrections[1];
        await second.populateAll()

        const response = await requests.reserve(second);
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });

    it('Should correct the third item', async (done) => {
        const third = this.corrections[2];
        await third.populateAll()

        const response = await requests.correct(third)
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the first item (reserved)', async (done) => {
        const first = this.corrections[0];

        const response = await requests.getNext(true);
        const { data, situacao} = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(data.id).toBe(first.id);
        expect(data.situacao).toBe(Status.RESERVADA);
        done()
    });

    it('Should correct the first item', async (done) => {
        const first = this.corrections[0];
        await first.populateAll()

        const response = await requests.correct(first)
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the second item (reserved)', async (done) => {
        const second = this.corrections[1];

        const response = await requests.getNext(true);
        const { data, situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(data.id).toBe(second.id);
        expect(data.situacao).toBe(Status.RESERVADA);
        done()
    });

    it('Should correct the fourth item', async (done) => {
        const fourth = this.corrections[3];
        await fourth.populateAll()

        const response = await requests.correct(fourth)
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });

    it('Should correct an item already corrected', async (done) => {
        const first = this.corrections[0];
        await first.populateAll()

        const response = await requests.correct(first)
        const { situacao, tipo } = response.body;

        expect(situacao).toBe('ERRO');
        expect(tipo).toBe('ITEM_CORRIGIDO');
        expect(response.status).toBe(400);
        done()
    });
    
    afterAll(async (done) => {
        dbUtils.closeConnection().then(done)
    });

});