import OrderModel from '../orders.model';
import Order from '../../types/order.type';
import CategoryModel from '../categories.model';
import ProductModel from '../product.model';
import Category from '../../types/category.type';
import User from '../../types/user.type';
import Product from '../../types/product.type';
import UserModel from '../users.model';
import client from '../../database';

const userModel = new UserModel();
const productModel = new ProductModel();
const categoryModel = new CategoryModel();
const orderModel = new OrderModel();

describe('Order Model', () => {
    describe('Check if All Methods Define', () => {
        it('check addProductToOrderDependOnAuthUser method define', () => {
            expect(orderModel.addProductToOrderDependOnAuthUser).toBeDefined();
        });

        it('check getOrderByStatusDependOnAuthUser method define', () => {
            expect(orderModel.getOrderByStatusDependOnAuthUser).toBeDefined();
        });

        it('check purchaseDependOnAuthUser method define', () => {
            expect(orderModel.purchaseDependOnAuthUser).toBeDefined();
        });
    });

    describe('Check Method Operations', () => {
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
            price: 1000,
            category_id: createCategory.id as string,
        };

        let orderId: string;

        beforeAll(async () => {
            const user = await userModel.create(createUser);
            createUser.id = user.id;

            const category = await categoryModel.create(createCategory);
            createCategory.id = category.id;

            const product = await productModel.create(createProduct);
            createProduct.id = product.id;
        });

        // remove all products from database
        afterAll(async () => {
            const conn = await client.connect();
            await conn.query('DELETE FROM users');
            await conn.query('DELETE FROM categories');
            await conn.query('DELETE FROM products');
            await conn.query('DELETE FROM orders');
            await conn.query('DELETE FROM products_orders');
            conn.release();
        });

        it('Create New Order If Not found order active for Auth User', async () => {
            const order = await orderModel.addProductToOrderDependOnAuthUser(
                {
                    product_id: createProduct.id,
                    quantity: 5,
                },
                createUser.id as string
            );
            orderId = order.order_id as string;

            expect(order.id).toBeDefined();
            expect(order.order_id).toBeDefined();
            expect(order.product_id).toEqual(createProduct.id);
            expect(order.quantity).toBe(5);
        });

        it('Check All Products in Active(Depend in second Parameter) Order For Auth User', async () => {
            const order = await orderModel.getOrderByStatusDependOnAuthUser(
                createUser.id as string,
                'active'
            );

            expect(order[0].id).toBeDefined();
            expect(order[0].total).toBeDefined();
            expect(order[0].status).toBe('active');
            expect(order[0].order_id).toBe(orderId as string);
            expect(order[0].product_id).toBe(createProduct.id);
            expect(order[0].quantity).toBe(5);
        });

        it('Purchase for Auth User', async () => {
            const purchaseOrder = await orderModel.purchaseDependOnAuthUser(
                createUser.id as string
            );
            expect(purchaseOrder?.id).toBeDefined();
            expect(purchaseOrder?.status).toContain('compelate');
            expect(purchaseOrder?.user_id).toEqual(createUser.id);
            expect(purchaseOrder?.total as number).toContain(5000 as number);
        });

        it('Check All Products in Complete(Depend in second Parameter) Order For Auth User', async () => {
            const order = await orderModel.getOrderByStatusDependOnAuthUser(
                createUser.id as string,
                'compelate'
            );

            expect(order[0].id).toBeDefined();
            expect(order[0].total).toBeDefined();
            expect(order[0].status).toBe('compelate');
            expect(order[0].order_id).toBe(orderId as string);
            expect(order[0].product_id).toBe(createProduct.id);
            expect(order[0].quantity).toBe(5);
        });
    });
});
