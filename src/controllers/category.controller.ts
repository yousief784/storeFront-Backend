import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import CategoryModel from '../models/categories.model';

const categoryModel = new CategoryModel();

class CategoryController {
    async index(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | object> {
        try {
            const getAllCategories = await categoryModel.index();
            if (!getAllCategories)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: getAllCategories,
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
    ): Promise<null | object | undefined> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }

            const { name } = req.body;

            const createNewCategory = await categoryModel.create({
                name,
            });

            if (!createNewCategory)
                res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: createNewCategory,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default CategoryController;
