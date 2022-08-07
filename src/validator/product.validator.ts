import { check } from 'express-validator';

export const createProductValidator = [
    check('name')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('Product name length should be more than 3 char'),
    check('price').isNumeric().notEmpty().withMessage('price should be number'),
    check('category_id')
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Choose Category'),
];

export default createProductValidator;
