const requests = require('../requests/correction.requests');
const mongoose = require('mongoose');

const Correction =  mongoose.model('Correction');
const factory = require('../utils/factories');
const dbUtils = require('../utils/database');


describe('Second Order for Corrections', () => {

    beforeAll(async (done) => {
        await dbUtils.truncade();
        
        this.corrections = await factory.createMany('Correction', 4)
        this.corrections = await Correction.find({}).sort({ ordem: 1})

        done();
    })

    it('Should reserve the first item', async (done) => {
        const first = this.corrections[0];

        const response = await requests.reserve(first);
        expect(response.status).toBe(200);
        done()
    });
    

    it('Should not reserve the third item', async (done) => {
        const third = this.corrections[2];
       
        const response = await requests.reserve(third);
        expect(response.status).not.toBe(200);
        done()
    });

    it('Should reserve the second item', async (done) => {
        const second = this.corrections[1];

        const response = await requests.reserve(second);
        expect(response.status).toBe(200);
        done()
    });

    it('Should correct the third item', async (done) => {
        const third = this.corrections[2];

        const response = await requests.correct(third)
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the first item (reserved)', async (done) => {
        const first = this.corrections[0];

        const response = await requests.getNext(true);
        const { data } = response.body;
        expect(data.id).toBe(first.id);
        done()
    });

    it('Should correct the first item', async (done) => {
        const first = this.corrections[0];

        const response = await requests.correct(first)
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the second item (reserved)', async (done) => {
        const second = this.corrections[1];

        const response = await requests.getNext(true);
        const { data } = response.body;
        expect(data.id).toBe(second.id);
        done()
    });

    it('Should correct the fourth item', async (done) => {
        const fourth = this.corrections[3];

        const response = await requests.correct(fourth)
        expect(response.status).toBe(200);
        done()
    });
    
    afterAll(async (done) => {
        dbUtils.closeConnection().then(done)
    });

});