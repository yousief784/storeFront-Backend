CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price NUMERIC NOT NULL,
    category_id uuid REFERENCES categories(id) ON DELETE CASCADE
)