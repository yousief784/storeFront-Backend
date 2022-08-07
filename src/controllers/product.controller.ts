import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ProductModel from '../models/product.model';

const proudctModel = new ProductModel();

class ProductController {
    async index(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<undefined | object> {
        try {
            const getAllProducts = await proudctModel.index();
            if (!getAllProducts)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: getAllProducts,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }

    async show(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<undefined | object> {
        try {
            const getProduct = await proudctModel.show(req.params.id);
            if (!getProduct)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found show Data',
                });
            res.status(200).json({
                status: 200,
                data: getProduct,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }

    async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<object | undefined> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }

            const { name, price, category_id } = req.body;

            const createNewProduct = await proudctModel.create({
                name,
                price,
                category_id,
            });

            if (!createNewProduct)
                res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: createNewProduct,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }

    async productByCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<object | undefined> {
        try {
            const getProductsDependOnCategory =
                await proudctModel.productByCategory(req.params.category_id);
            if (!getProductsDependOnCategory)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found show Data',
                });
            res.status(200).json({
                status: 200,
                data: getProductsDependOnCategory,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ProductController;
