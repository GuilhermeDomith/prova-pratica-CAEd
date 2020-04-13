const request = require('supertest');

const app = require('../../src/app');
const { truncade } = require('../utils/database');
const factory = require('../utils/factories');
const { Correction } = require('../../src/model/correction.model');

describe('Corrections', () => {
    beforeAll(async (done) => {
        await truncade();

        this.corrections = await Promise.all(
            Array.from({length: 3}, (v, k) => 
                factory.create('Correction'))
        );

        done();
    })

    it('Should get the next item to be corrected', async (done) => {
        const response = await request(app)
            .get('/correcoes/proxima');

        const { data } = response.body;
        console.log(data);
        expect(data.ordem).toBe(this.corrections[0].ordem);
        done()
    });

    it('Should correct the item', async (done) => {
        const response = await request(app)
            .post(`/correcoes/${this.corrections[0]._id}`);

        console.log(`/correcoes/${this.corrections[0]._id}`);
        expect(response.status).toBe(200);
        done()
    });

    it('Should get the next item to be corrected', async (done) => {
        const response = await request(app)
            .get('/correcoes/proxima');

        const { data } = response.body;
        console.log(data);
        expect(data.ordem).toBe(this.corrections[1].ordem);
        done()
    });

});