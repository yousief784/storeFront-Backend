import { Router } from 'express';
import createorderValidator from '../../validator/order.validator';
import OrderController from '../../controllers/order.controller';
import validTokenMiddleware from '../../middlewares/authenticate.middleware';
const ordersRouter: Router = Router();

const orderController = new OrderController();

ordersRouter.use(validTokenMiddleware);

ordersRouter.put('/purchase', orderController.purchaseDependOnAuthUser);

ordersRouter.post(
    '/',
    createorderValidator,
    orderController.addProductToOrderForAuthUser
);

ordersRouter.get('/:status', orderController.getOrderByStatusDependOnAuthUser);

export default ordersRouter;
