import client from '../database';
import Category from '../types/category.type';

class CategoryModel {
    async index(): Promise<Category[] | undefined> {
        try {
            const conn = await client.connect();
            const sql: string = 'SELECT id, name from categories';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Can't get all categories from database: ${error}`);
        }
    }

    async create(category: Category): Promise<Category> {
        try {
            const conn = await client.connect();
            const sql: string =
                'INSERT INTO categories(name) VALUES ($1) RETURNING *';
            const result = await conn.query(sql, [category.name]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Can't Create New Category, try Again: ${error}`);
        }
    }
}

export default CategoryModel;
