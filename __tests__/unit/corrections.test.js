const request = require('supertest');
const app = require('../../src/app');

describe('Corrections', () => {
    it('Should get the next question to be corrected', async () => {
        const response = await request(app)
            .get('/correcoes/proxima');

        expect(response.status).toBe(200);
    });
});