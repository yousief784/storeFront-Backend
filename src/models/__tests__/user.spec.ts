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
        it('check authenticate method define', () => {
            expect(userModel.authenticate).toBeDefined();
        });
    });

    describe('Check Method Operations', () => {
        // create user to test
        const createUser: User = {
            first_name: 'Yousief',
            last_name: 'Noaman',
            user_name: 'yousief784',
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

        // authenticate method with valid info in UserModel
        it('IF Authenticate with Valid Infromation Should Return User Authenticate Information equal createUserInfo', async () => {
            const auth = await userModel.authenticate(
                createUser.user_name as string,
                createUser.password
            );
            expect(auth?.id).toEqual(createUser.id);
            expect(auth?.first_name).toEqual(createUser.first_name);
            expect(auth?.last_name).toEqual(createUser.last_name);
            expect(auth?.user_name).toEqual(createUser.user_name);
        });

        // authenticate method with invalid info in UserModel
        it('IF Authenticate with Invalid Infromation Should Return User Authenticate Information equal createUserInfo', async () => {
            const auth = await userModel.authenticate(
                'fakeUserName',
                'fakePassword'
            );
            expect(auth).toBeNull();
        });

        // create method in UserModel
        it('Create Method Should Return UserObject[id, first_name, last_name, user_name]', async () => {
            const createUser = await userModel.create({
                first_name: 'test',
                last_name: 'test2',
                user_name: 'test123',
                password: 'test123',
            });
        });

        // index method in UserModel
        it('Index Method Should Return 2 Users in database 1 created by createUser in beforeAll and 1 created by userModel.create test', async () => {
            const allUsers = await userModel.index();
            expect(allUsers?.length).toEqual(2);
        });

        // show method in UserModel
        it('Show Method Should Return 1 user depended on user_name send', async () => {
            const user = await userModel.show(createUser.user_name as string);
            expect(user?.id).toEqual(createUser.id);
            expect(user?.first_name).toEqual(createUser.first_name);
            expect(user?.last_name).toEqual(createUser.last_name);
            expect(user?.user_name).toEqual(createUser.user_name);
        });
    });
});
