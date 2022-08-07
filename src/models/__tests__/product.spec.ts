import CategoryModel from '../categories.model';
import ProductModel from '../product.model';
import Category from '../../types/category.type';
import Product from '../../types/product.type';
import client from '../../database';

const categoryModel = new CategoryModel();
const productModel = new ProductModel();

describe('Product Model', () => {
    describe('check if All method Define', () => {
        it('check create method define', () => {
            expect(productModel.create).toBeDefined();
        });
        it('check index method define', () => {
            expect(productModel.index).toBeDefined();
        });
        it('check show method define', () => {
            expect(productModel.show).toBeDefined();
        });
        it('check productByCategory method define', () => {
            expect(productModel.productByCategory).toBeDefined();
        });
    });

    describe('Check Method Operations', () => {
        const createCategory: Category = {
            name: 'Technologies',
        };

        const createProduct: Product = {
            name: 'Moblie',
            price: 5000,
            category_id: '',
        };

        beforeAll(async () => {
            const category = await categoryModel.create(createCategory);
            createCategory.id = category.id;
            createProduct.category_id = createCategory.id as string;

            const product = await productModel.create(createProduct);
            createProduct.id = product.id;
        });

        // remove all products from database
        afterAll(async () => {
            const conn = await client.connect();
            await conn.query('DELETE FROM categories');
            await conn.query('DELETE FROM products');
            conn.release();
        });

        // create method return object of product created [id, name, price, category_id]
        it('Create Method Return Object of Product [id, name, price, category_id]', async () => {
            const product = await productModel.create({
                name: 'test Product',
                price: 1000,
                category_id: createCategory.id as string,
            });

            expect(product.id).toBeDefined();
            expect(product.price).toBeDefined();
            expect(product.name).toEqual('test Product');
            expect(product.category_id).toEqual(createCategory.id as string);
        });

        it('Index Method Should Return 2 Products in database 1 created by createProduct in beforeAll and 1 created by productModel.create test', async () => {
            const products = await productModel.index();
            expect(products?.length).toEqual(2);
        });

        it('Show Method Should Return 1 product depended on poructId send', async () => {
            const getOneProuct = await productModel.show(
                createProduct.id as string
            );

            expect(getOneProuct?.id).toBeDefined();
            expect(getOneProuct?.price).toBeDefined();
            expect(getOneProuct?.name).toEqual('Moblie');
            expect(getOneProuct?.category_id).toEqual(createCategory.id);
        });

        it('productByCategory Method Should Return 2 Products in category 1 created by createProduct in beforeAll and 1 created by productModel.create to same Category test', async () => {
            const productsByCategory = await productModel.productByCategory(
                createCategory.id as string
            );
            expect(productsByCategory?.length).toEqual(2);
        });
    });
});
