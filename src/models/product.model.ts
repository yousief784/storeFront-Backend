import client from '../database';
import Product from '../types/product.type';

class ProductModel {
    // get All Products
    async index(): Promise<Product[] | undefined> {
        try {
            const conn = await client.connect();
            const sql: string = 'SELECT * from products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Can't get all products from database: ${error}`);
        }
    }

    // get One Product By id
    async show(id: string): Promise<Product | null> {
        try {
            const conn = await client.connect();
            const sql: string = 'SELECT * from products WHERE id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rowCount) return result.rows[0];
            return null;
        } catch (error) {
            throw new Error(`Can't get this Proudct from database: ${error}`);
        }
    }

    // Create new Product
    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql: string =
                'INSERT INTO products(name, price, category_id) VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [
                product.name,
                product.price,
                product.category_id,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Can't Create New Product, try Again: ${error}`);
        }
    }

    // get All products in on category depend on category_id
    async productByCategory(category_id: string): Promise<Product[] | null> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * FROM products JOIN categories ON products.category_id=categories.id WHERE categories.id=$1';
            const result = await conn.query(sql, [category_id]);
            conn.release();
            if (!result.rowCount) return null;
            return result.rows;
        } catch (error) {
            throw new Error(
                `Can't get All Products depend on Category, try Again: ${error}`
            );
        }
    }
}

export default ProductModel;
