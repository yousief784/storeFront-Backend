import User from '../../types/user.type';
import app from '../../index';
import supertest from 'supertest';
import client from '../../database';
import UserModel from '../../models/users.model';

const req = supertest(app);
const userModel = new UserModel();

describe('User API Endpoints', () => {
    const createUser: User = {
        first_name: 'Yousief',
        last_name: 'Noaman',
        user_name: 'yousief784',
        password: 'yousief784',
    };

    let token: string;
    beforeAll(async () => {
        const user = await userModel.create(createUser);
        createUser.id = user.id;
    });

    // remove all users from database
    afterAll(async () => {
        const conn = await client.connect();
        await conn.query('DELETE FROM users');
        conn.release();
    });

    it('Test Authenticate with valid UserInfo Get Token', async () => {
        const res = await req.post('/api/users/auth').send({
            user_name: 'yousief784',
            password: 'yousief784',
        });

        expect(res.status).toBe(200);
        expect(res.body.data.user_name).toBe('yousief784');
        expect(res.body.data.token).toBeDefined();
        token = res.body.data.token;
    });

    it('Test Authenticate with Invalid userInfo', async () => {
        const res = await req.post('/api/users/auth').send({
            user_name: 'fakeUsername',
            password: 'fakePassword',
        });

        expect(res.status).toBe(400);
        expect(res.body.errorMessage).toBeDefined();
    });

    it('Create Api [token_required]', async () => {
        const res = await req
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: 'test',
                last_name: 'test1',
                user_name: 'test123',
                password: 'test123',
            });

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.first_name).toBe('test');
        expect(res.body.data.last_name).toBe('test1');
        expect(res.body.data.user_name).toBe('test123');
    });

    it('index(getAllUsers) Api [token_required]', async () => {
        const res = await req
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data[0].id).toBeDefined();
        expect(res.body.data[0].first_name).toBe('Yousief');
        expect(res.body.data[0].last_name).toBe('Noaman');
        expect(res.body.data[0].user_name).toBe('yousief784');
        expect(res.body.data.length).toBe(2);
    });

    it('show(user_name) GetOne By Id Api [token_required]', async () => {
        const res = await req
            .get(`/api/users/${createUser.user_name}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.first_name).toBe('Yousief');
        expect(res.body.data.last_name).toBe('Noaman');
        expect(res.body.data.user_name).toBe('yousief784');
    });
});
