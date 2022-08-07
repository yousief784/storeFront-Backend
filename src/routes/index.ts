import { Router } from 'express';
import categoriesRouter from './api/categories.routes';
import ordersRouter from './api/order.routes';
import productsRouter from './api/porducts.routes';
import userRouter from './api/users.routes';

const router: Router = Router();

router.use('/users', userRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);

export default router;
