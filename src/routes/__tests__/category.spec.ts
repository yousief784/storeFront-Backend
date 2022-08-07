import app from '../../index';
import supertest from 'supertest';
import client from '../../database';
import User from '../../types/user.type';
import UserModel from '../../models/users.model';

const req = supertest(app);
const userModel = new UserModel();

describe('Category API Endpoints', () => {
    const createUser: User = {
        first_name: 'Yousief',
        last_name: 'Noaman',
        user_name: 'yousief784',
        password: 'yousief784',
    };

    let token: string;
    beforeAll(async () => {
        const user = await userModel.create(createUser);

        const authUser = await req.post('/api/users/auth').send({
            user_name: createUser.user_name,
            password: createUser.password,
        });

        token = authUser.body.data.token;
    });

    // remove all products from database
    afterAll(async () => {
        const conn = await client.connect();
        await conn.query('DELETE FROM categories');
        await conn.query('DELETE FROM users');
        conn.release();
    });

    it('Create New Category [token_required]', async () => {
        const res = await req
            .post('/api/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Techonologies',
            });

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('Techonologies');
    });

    it('index(GetAllCategories) test [token_required]', async () => {
        const res = await req
            .get('/api/categories')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data[0].id).toBeDefined();
        expect(res.body.data[0].name).toBe('Techonologies');
    });
});
