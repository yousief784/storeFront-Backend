import { check } from 'express-validator';

export const createCategoryValidator = [
    check('name')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('Category name length should be more than 3 char'),
];

export default createCategoryValidator;
