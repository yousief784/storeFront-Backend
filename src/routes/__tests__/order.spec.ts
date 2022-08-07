import app from '../../index';
import supertest from 'supertest';
import client from '../../database';
import User from '../../types/user.type';
import UserModel from '../../models/users.model';
import CategoryModel from '../../models/categories.model';
import ProductModel from '../../models/product.model';
import Category from '../../types/category.type';
import Product from '../../types/product.type';

const req = supertest(app);
const userModel = new UserModel();
const categoryModel = new CategoryModel();
const productModel = new ProductModel();

describe('Order API Endpoints', () => {
    const createUser: User = {
        first_name: 'Yousief',
        last_name: 'Noaman',
        password: 'yousief784',
    };

    const createCategory: Category = {
        name: 'Technologies',
    };

    const createProduct: Product = {
        name: 'Mobile',
        price: 5000,
        category_id: createCategory.id as string,
    };

    let orderId: string;
    let token: string;
    beforeAll(async () => {
        const user = await req.post('/api/users').send(createUser);
        createUser.id = user.body.data.id;
        token = user.body.data.token;

        const category = await categoryModel.create(createCategory);
        createCategory.id = category.id;

        const product = await productModel.create(createProduct);
        createProduct.id = product.id;
    });

    // remove all from database
    afterAll(async () => {
        const conn = await client.connect();
        await conn.query('DELETE FROM users');
        await conn.query('DELETE FROM products');
        await conn.query('DELETE FROM categories');
        await conn.query('DELETE FROM orders');
        await conn.query('DELETE FROM products_orders');
        conn.release();
    });

    it('Create New Order [token_required]', async () => {
        const res = await req
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                product_id: createProduct.id,
                quantity: 5,
            });

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.order_id).toBeDefined();
        expect(res.body.data.product_id).toEqual(createProduct.id);
        expect(res.body.data.quantity).toBe(5);

        orderId = res.body.data.order_id;
    });

    it('Get Active Orders For AuthUser [token_required]', async () => {
        const res = await req
            .get('/api/orders/active')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data[0].id).toBeDefined();
        expect(res.body.data[0].total).toContain(25000);
        expect(res.body.data[0].status).toBe('active');
        expect(res.body.data[0].order_id).toBe(orderId as string);
        expect(res.body.data[0].product_id).toBe(createProduct.id);
        expect(res.body.data[0].quantity).toBe(5);
    });

    it('Purchase Active Order For AuthUser [token_required]', async () => {
        const res = await req
            .put('/api/orders/purchase')
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.user_id).toEqual(createUser.id);
        expect(res.body.data.total as number).toContain(25000 as number);
    });

    it('Get Compleated Orders For AuthUser [token_required]', async () => {
        const res = await req
            .get('/api/orders/compelate')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data[0].id).toBeDefined();
        expect(res.body.data[0].total).toContain(25000);
        expect(res.body.data[0].status).toBe('compelate');
        expect(res.body.data[0].order_id).toBe(orderId as string);
        expect(res.body.data[0].product_id).toBe(createProduct.id);
        expect(res.body.data[0].quantity).toBe(5);
    });
});
