const requests = require('../requests/correction.requests');
const mongoose = require('mongoose');

const Correction =  mongoose.model('CorrectionItem');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');
const Status = Correction.Status;


describe('First Order for Corrections', () => {
    
    beforeAll(async (done) => {
        await dbUtils.truncade();
        
        const options = await factory.createMany('Option', 10);
        const questions = await factory.createMany('Question', 10, {}, { options })
        await factory.createMany('CorrectionItem', 3, {}, { questions })

        this.corrections = await Correction.find({}).sort({ ordem: 1});

        done();
    })

    it('Should get the first item (available)', async (done) => {
        const first = this.corrections[0];

        const response = await requests.getNext(false);
        const { data, situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(data.id).toBe(first.id);
        expect(data.situacao).toBe(Status.DISPONIVEL);
        done()
    });

    it('Should correct the first item', async (done) => {
        const first = this.corrections[0];
        await first.populateAll()
       
        const response = await requests.correct(first);
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });

    it('Should not correct third item', async (done) => {
        const third = this.corrections[2];
        await third.populateAll()

        const response = await requests.correct(third);
        const { situacao, tipo } = response.body;

        expect(situacao).toBe('ERRO');
        expect(tipo).toBe('ITEM_INVALIDO');
        expect(response.status).toBe(400);
        done()
    });

    it('Should reserve second item', async (done) => {
        const second = this.corrections[1];
        await second.populateAll()

        const response = await requests.reserve(second)
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the third item (available)', async (done) => {
        const third = this.corrections[2];

        const response = await requests.getNext(false);
        const { data, situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(data.id).toBe(third.id);
        expect(data.situacao).toBe(Status.DISPONIVEL);
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

    it('Should get all reserved items', async (done) => {
        const second = this.corrections[1];

        const response = await requests.listReserved();
        const { data, situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(data.length).toBe(1)
        expect(data[0].id).toBe(second.id);
        done()
    });

    it('Should get reserved item when availables is finished', async (done) => {
        const second = this.corrections[1];

        const response = await requests.getNext(false);
        const { data, situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(data.id).toBe(second.id);
        expect(data.situacao).toBe(Status.RESERVADA);
        done()
    });

    it('Should mark the second item as brocked', async (done) => {
        const second = this.corrections[1];

        const response = await requests.marckAsBrocked(second);
        const { situacao } = response.body;

        expect(situacao).toBe('SUCESSO');
        expect(response.status).toBe(200);
        done()
    });
    
    it('Should get null data when items are finished', async (done) => {
        
        const response = await requests.getNext(false);
        const { data, situacao } = response.body;

        expect(situacao).toBe('ERRO');
        expect(data).toBe(null);
        expect(response.status).toBe(200);
        done()
    });
    
    afterAll(async (done) => {
        dbUtils.closeConnection().then(done)
    });

});