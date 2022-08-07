import client from '../database';
import User from '../types/user.type';
import bcrypt from 'bcrypt';
import config from '../config';
class UserModel {
    private hashPassword(password: string) {
        return bcrypt.hashSync(
            password + config.pepper,
            parseInt(config.salt as string)
        );
    }

    // get all users in system[token]
    async index(): Promise<User[] | undefined> {
        try {
            const conn = await client.connect();
            const sql: string =
                'SELECT id, first_name, last_name from users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Can't get all user from database: ${error}`);
        }
    }

    // get one user by id [token]
    async show(id: string): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql: string =
                'SELECT id, first_name, last_name from users WHERE id=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rowCount) return result.rows[0];
            return null;
        } catch (error) {
            throw new Error(`Can't get this user from database: ${error}`);
        }
    }

    // create new user
    async create(user: User): Promise<User> {
        try {
            const conn = await client.connect();
            const hashedPassword = this.hashPassword(user.password);
            const sql: string =
                'INSERT INTO users(first_name, last_name, password) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, password';
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                hashedPassword,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Can't Create New Account, try Again: ${error}`);
        }
    }
}

export default UserModel;
