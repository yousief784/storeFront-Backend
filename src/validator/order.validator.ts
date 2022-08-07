import { check } from 'express-validator';

export const createorderValidator = [
    check('product_id').notEmpty().withMessage('Should have product_id'),
    check('quantity').notEmpty().withMessage('Should have quantity'),
];

export default createorderValidator;
