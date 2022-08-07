import dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    NODE_ENV,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB_DEV,
    POSTGRES_DB_TEST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    BCRYPT_PEPPER,
    SALT_ROUND,
    TOKEN_SECRET,
} = process.env;

export default {
    port: PORT,
    host: POSTGRES_HOST,
    dbPort: POSTGRES_PORT,
    database: NODE_ENV === 'dev' ? POSTGRES_DB_DEV : POSTGRES_DB_TEST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    pepper: BCRYPT_PEPPER,
    salt: SALT_ROUND,
    tokenSecret: TOKEN_SECRET,
};
