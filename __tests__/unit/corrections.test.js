const request = require('supertest');

const app = require('../../src/app');
const factory = require('../utils/factories');
const { truncade } = require('../utils/database');
const { Correction } = require('../../src/model/correction.model');

describe('Order by Corrections', () => {
    beforeAll(async (done) => {
        await truncade();

        this.corrections = await Promise.all(
            Array.from({length: 3}, (v, k) => 
                factory.create('Correction'))
        );

        done();
    })

    it('Should get the first item', async (done) => {
        const first = this.corrections[0];

        const response = await request(app).get('/correcoes/proxima');
        const { data } = response.body;

        expect(data.ordem).toBe(first.ordem);
        expect(data.id).toBe(first.id);
        done()
    });

    it('Should correct the first item', async (done) => {
        const first = this.corrections[0];
        const keysCorrected = first.chave.map((key) => {
            return {
                id: key.id,
                valor: key.opcoes[0].valor
            }
        });

        const response = await request(app)
            .post(`/correcoes/${first.id}`)
            .send({ chave: keysCorrected });

        expect(response.status).toBe(200);
        done()
    });

    it('Should not correct third item', async (done) => {
        const third = this.corrections[2];

        const response = await request(app)
            .post(`/correcoes/${third.id}`);

        expect(response.status).not.toBe(200);
        done()
    });

    it('Should reserve second item', async (done) => {
        const second = this.corrections[1];

        const response = await request(app)
            .post(`/correcoes/reservadas/${second.id}`);

        expect(response.status).toBe(200);
        done()
    });

    it('Should get the third item', async (done) => {
        const third = this.corrections[2];

        const response = await request(app).get('/correcoes/proxima');
        const { data } = response.body;

        expect(data.ordem).toBe(third.ordem);
        expect(data.id).toBe(third.id);
        done()
    });

    it('Should correct the third item', async (done) => {
        const third = this.corrections[2];
        const keysCorrected = third.chave.map((key) => {
            return {
                id: key.id,
                valor: key.opcoes[0].valor
            }
        });

        const response = await request(app)
            .post(`/correcoes/${third.id}`)
            .send({ chave: keysCorrected });

        expect(response.status).toBe(200);
        done()
    });

});