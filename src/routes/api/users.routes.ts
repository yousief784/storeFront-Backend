import {
    createUserValidator,
    authenticateUserValidator,
} from './../../validator/user.validator';
import { Router } from 'express';
import UserController from '../../controllers/users.controller';
import validTokenMiddleware from '../../middlewares/authenticate.middleware';
const userRouter: Router = Router();

const userController = new UserController();

userRouter.post('/auth', userController.authenticate);

userRouter.use(validTokenMiddleware);

userRouter
    .route('/')
    .get(userController.index)
    .post(createUserValidator, userController.create);

userRouter.route('/:user_name').get(userController.show);

export default userRouter;
