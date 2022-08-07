import CategoryModel from '../categories.model';
import Category from '../../types/category.type';
import client from '../../database';

const categoryModel = new CategoryModel();

describe('Category Model', () => {
    describe('Check if All Methods Define', () => {
        it('check create method define', () => {
            expect(categoryModel.create).toBeDefined();
        });

        it('check index method define', () => {
            expect(categoryModel.index).toBeDefined();
        });
    });

    describe('Check Method Operations', () => {
        // remove all categories from database
        afterAll(async () => {
            const conn = await client.connect();
            await conn.query('DELETE FROM categories');
            conn.release();
        });

        it('Create Method Return Object of Category [id, name]', async () => {
            const createCategory = await categoryModel.create({
                name: 'Test Category',
            });

            expect(createCategory.id).toBeDefined();
            expect(createCategory.name).toEqual('Test Category');
        });

        it('Index Method Should Return 1 Category in database 1 created by createCategory beforAll method', async () => {
            const allCategories = await categoryModel.index();
            expect(allCategories?.length).toEqual(1);
        });
    });
});
