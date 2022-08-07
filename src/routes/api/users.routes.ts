import { createUserValidator } from './../../validator/user.validator';
import { Router } from 'express';
import UserController from '../../controllers/users.controller';
import validTokenMiddleware from '../../middlewares/authenticate.middleware';
const userRouter: Router = Router();

const userController = new UserController();

userRouter.post('/', createUserValidator, userController.create);

userRouter.use(validTokenMiddleware);

userRouter.route('/').get(userController.index);

userRouter.route('/:id').get(userController.show);

export default userRouter;
