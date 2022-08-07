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
                'SELECT id, first_name, last_name, user_name from users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Can't get all user from database: ${error}`);
        }
    }

    // get one user by user_name not id[token]
    async show(user_name: string): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql: string =
                'SELECT id, first_name, last_name, user_name from users WHERE user_name=$1';
            const result = await conn.query(sql, [user_name]);
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
                'INSERT INTO users(first_name, last_name, user_name, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, user_name, password';
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                user.user_name,
                hashedPassword,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Can't Create New Account, try Again: ${error}`);
        }
    }

    // check if user_name and password true
    async authenticate(
        user_name: string,
        password: string
    ): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sqlGetPassword =
                'SELECT  password FROM users WHERE user_name=$1';
            const result = await conn.query(sqlGetPassword, [user_name]);
            if (result.rowCount) {
                const checkPassword = bcrypt.compareSync(
                    password + config.pepper,
                    result.rows[0].password
                );
                if (!checkPassword) return null;
            } else {
                return null;
            }
            const sqlGetUser =
                'SELECT id, first_name, last_name, user_name FROM users WHERE user_name=$1';
            const userInfo = await conn.query(sqlGetUser, [user_name]);
            conn.release();
            return userInfo.rows[0];
        } catch (error) {
            throw new Error(`Can't Authenticate: Error ${error}`);
        }
    }
}

export default UserModel;
