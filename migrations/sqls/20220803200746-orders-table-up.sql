CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TYPE IF EXISTS statusOfOrder;
CREATE TYPE statusOfOrder AS ENUM ('active', 'compelate') ;

CREATE TABLE orders(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    status statusOfOrder DEFAULT 'active',
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    total NUMERIC NOT NULL
)