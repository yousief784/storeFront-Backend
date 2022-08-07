import app from '../index';
import supertest from 'supertest';

const request = supertest(app);

describe('TEST IF SERVER IS RUNNING', () => {
    it('server run', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
    });
});
