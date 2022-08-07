import User from '../../types/user.type';
import app from '../../index';
import supertest from 'supertest';
import client from '../../database';
import UserModel from '../../models/users.model';
import Category from '../../types/category.type';
import CategoryModel from '../../models/categories.model';

const req = supertest(app);
const userModel = new UserModel();
const categoryModel = new CategoryModel();

describe('Products API Endpoints', () => {
    const createUser: User = {
        first_name: 'Yousief',
        last_name: 'Noaman',
        password: 'yousief784',
    };

    const createCategory: Category = {
        name: 'Technologies',
    };

    let productId: string;
    let token: string;
    beforeAll(async () => {
        const user = await req.post('/api/users').send(createUser);
        token = user.body.data.token;

        const category = await categoryModel.create(createCategory);
        createCategory.id = category.id;
    });

    // remove all from database
    afterAll(async () => {
        const conn = await client.connect();
        await conn.query('DELETE FROM users');
        await conn.query('DELETE FROM products');
        await conn.query('DELETE FROM categories');
        conn.release();
    });

    it('Create New Product [token_required]', async () => {
        const res = await req
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Mobile',
                price: 5000,
                category_id: createCategory.id,
            });

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('Mobile');
        expect(res.body.data.price).toContain(5000);
        expect(res.body.data.category_id).toBe(createCategory.id);

        productId = res.body.data.id;
    });

    it('index(GetAllProducts) test', async () => {
        const res = await req.get('/api/products');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
    });

    it('show(productId) getOne Product Depend on Product_id', async () => {
        const res = await req.get(`/api/products/${productId}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.name).toBe('Mobile');
        expect(res.body.data.price).toContain(5000);
        expect(res.body.data.category_id).toBe(createCategory.id);
    });

    it('productByCategory(category_id) Get All Products in 1 category send in params', async () => {
        const res = await req.get(
            `/api/products/category/${createCategory.id}`
        );

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
    });
});
