import { createProductValidator } from './../../validator/product.validator';
import { Router } from 'express';
import ProductController from '../../controllers/product.controller';
import validTokenMiddleware from '../../middlewares/authenticate.middleware';
const productsRouter: Router = Router();

const productController = new ProductController();

productsRouter.get(
    '/category/:category_id',
    productController.productByCategory
);
productsRouter.get('/', productController.index);
productsRouter.get('/:id', productController.show);

productsRouter.post(
    '/',
    validTokenMiddleware,
    createProductValidator,
    productController.create
);

export default productsRouter;
