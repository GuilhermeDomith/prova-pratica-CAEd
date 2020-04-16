const requests = require('../requests/correction.requests');
const mongoose = require('mongoose');

const Correction =  mongoose.model('Correction');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');


describe('First Order for Corrections', () => {
    
    beforeAll(async (done) => {
        await dbUtils.truncade();
        
        this.corrections = await factory.createMany('Correction', 3)
        this.corrections = await Correction.find({}).sort({ ordem: 1})

        done();
    })

    it('Should get the first item (available)', async (done) => {
        const first = this.corrections[0];

        const response = await requests.getNext(false);
        const { data } = response.body;
        expect(data.id).toBe(first.id);
        done()
    });

    it('Should correct the first item', async (done) => {
        const first = this.corrections[0];
       
        const response = await requests.correct(first);
        expect(response.status).toBe(200);
        done()
    });

    it('Should not correct third item', async (done) => {
        const third = this.corrections[2];

        const response = await requests.correct(third);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should reserve second item', async (done) => {
        const second = this.corrections[1];

        const response = await requests.reserve(second)
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the third item (available)', async (done) => {
        const third = this.corrections[2];

        const response = await requests.getNext(false);
        const { data } = response.body;
        expect(data.id).toBe(third.id);
        done()
    });

    it('Should correct the third item', async (done) => {
        const third = this.corrections[2];

        const response = await requests.correct(third)
        expect(response.status).toBe(200);
        done()
    });

    it('Should get null data', async (done) => {
        const third = this.corrections[2];

        const response = await requests.getNext(false);
        const { data } = response.body;

        expect(data).toBe(null);
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the second item (reserved)', async (done) => {
        const second = this.corrections[1];

        const response = await requests.getNext(true)
        const { data } = response.body;

        expect(data.id).toBe(second.id);
        done()
    });

    it('Should get all reserved items', async (done) => {
        const second = this.corrections[1];

        const response = await requests.listReserved();
        const { data } = response.body;

        expect(data.length).toBe(1)
        expect(data[0].id).toBe(second.id);
        done()
    });
    
    afterAll(async (done) => {
        dbUtils.closeConnection().then(done)
    });

});