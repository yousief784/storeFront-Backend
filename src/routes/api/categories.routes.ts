import { createCategoryValidator } from './../../validator/category.validator';
import { Router } from 'express';
import CategoryController from '../../controllers/category.controller';
import validTokenMiddleware from '../../middlewares/authenticate.middleware';
const categoriesRouter: Router = Router();

const categoryController = new CategoryController();

categoriesRouter.use(validTokenMiddleware);

categoriesRouter
    .route('/')
    .get(categoryController.index)
    .post(createCategoryValidator, categoryController.create);

export default categoriesRouter;
