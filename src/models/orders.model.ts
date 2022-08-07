import client from '../database';
import Order from '../types/order.type';
import Product_Order from '../types/product_order.type';

class OrderModel {
    async addProductToOrderDependOnAuthUser(
        order: Product_Order,
        userId: string
    ) {
        try {
            const conn = await client.connect();
            // get order_id, order status and product price
            const sqlGetIfOrderStatusActive =
                "SELECT orders.id, orders.status, products.price, orders.total from orders JOIN products_orders ON orders.id=products_orders.order_id Join products ON products_orders.product_id=products.id WHERE orders.user_id=$1 AND orders.status='active'";
            const resultGetIfOrderStatusActive = await conn.query(
                sqlGetIfOrderStatusActive,
                [userId]
            );

            let orderId: string;
            let totalOrder: number;
            let price: number;
            if (!resultGetIfOrderStatusActive.rowCount) {
                // create new order
                const sqlCreateNewOrder =
                    'INSERT INTO orders(user_id, total) VALUES ($1, 0) RETURNING id, total';
                const resultCreateNewOrder = await conn.query(
                    sqlCreateNewOrder,
                    [userId]
                );

                // get price from product table
                const sqlGetPriceFromProductTable =
                    'SELECT price FROM products WHERE id=$1';
                const resultGetPriceFromProductTable = await conn.query(
                    sqlGetPriceFromProductTable,
                    [order.product_id as string]
                );

                price = resultGetPriceFromProductTable.rows[0].price;
                totalOrder = resultCreateNewOrder.rows[0].total;
                orderId = resultCreateNewOrder.rows[0].id;
            } else {
                totalOrder = parseInt(
                    resultGetIfOrderStatusActive.rows[0].total
                );
                price = parseFloat(resultGetIfOrderStatusActive.rows[0].price);
                orderId = resultGetIfOrderStatusActive.rows[0].id;
            }
            // add new product to order
            const sqlAddProductToOrder =
                'INSERT INTO products_orders(order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
            const resultAddProductToOrder = await conn.query(
                sqlAddProductToOrder,
                [orderId, order.product_id, order.quantity]
            );

            // update orders(total) column orders_product(quantit) * product(price)
            const sqlUpdateTotalColumn =
                'UPDATE orders SET total=$1 WHERE id=$2';
            const total =
                totalOrder +
                price * parseInt(resultAddProductToOrder.rows[0].quantity);
            const resultUpdateTotalColumn = await conn.query(
                sqlUpdateTotalColumn,
                [total, orderId]
            );
            conn.release();
            return resultAddProductToOrder.rows[0];
        } catch (error) {
            throw new Error(`Can't Create New Order : ${error}`);
        }
    }

    async getOrderByStatusDependOnAuthUser(userId: string, status: string) {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * from orders JOIN products_orders ON products_orders.order_id=orders.id WHERE user_id=$1 AND status=$2';
            const result = await conn.query(sql, [userId, status]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(
                `Can't get all Compleated Orders from database: ${error}`
            );
        }
    }

    async purchaseDependOnAuthUser(userId: string): Promise<Order | null> {
        try {
            const conn = await client.connect();
            const sql =
                "UPDATE orders SET status='compelate' WHERE user_id=$1 AND status='active' RETURNING *";
            const result = await conn.query(sql, [userId]);
            conn.release();
            if (!result.rowCount) return null;
            return result.rows[0];
        } catch (error) {
            throw new Error(`Can't continue Purchase: error ${error}`);
        }
    }
}

export default OrderModel;
