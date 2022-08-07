CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products_orders(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL
)