import client from '../../database';
import User from '../../types/user.type';
import UserModel from '../users.model';

const userModel = new UserModel();

describe('User Model', () => {
    describe('check if All method Define', () => {
        it('check create method define', () => {
            expect(userModel.create).toBeDefined();
        });
        it('check index method define', () => {
            expect(userModel.index).toBeDefined();
        });
        it('check show method define', () => {
            expect(userModel.show).toBeDefined();
        });
    });

    describe('Check Method Operations', () => {
        // create user to test
        const createUser: User = {
            first_name: 'Yousief',
            last_name: 'Noaman',
            password: 'yousief784',
        };
        beforeAll(async () => {
            const user = await userModel.create(createUser);
            createUser.id = user.id;
        });

        // remove all users from database
        afterAll(async () => {
            const conn = await client.connect();
            await conn.query('DELETE FROM users');
            conn.release();
        });

        // create method in UserModel
        it('Create Method Should Return UserObject[id, first_name, last_name]', async () => {
            const createUser = await userModel.create({
                first_name: 'test',
                last_name: 'test2',
                password: 'test123',
            });
        });

        // index method in UserModel
        it('Index Method Should Return 2 Users in database 1 created by createUser in beforeAll and 1 created by userModel.create test', async () => {
            const allUsers = await userModel.index();
            expect(allUsers?.length).toEqual(2);
        });

        // show method in UserModel
        it('Show Method Should Return 1 user depended on id send', async () => {
            const user = await userModel.show(createUser.id as string);
            expect(user?.id).toEqual(createUser.id);
            expect(user?.first_name).toEqual(createUser.first_name);
            expect(user?.last_name).toEqual(createUser.last_name);
        });
    });
});
