import { check } from 'express-validator';

export const createUserValidator = [
    check('first_name')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('length should be more than 3 char'),
    check('last_name')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('length should be more than 3 char'),
    check('user_name')
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage('length should be more than 3 char'),
    check('password')
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('length should be more than 5 char'),
];

export const authenticateUserValidator = [
    check('user_name').isLength({ min: 1 }).withMessage('empty string'),
    check('password').isLength({ min: 1 }).withMessage('empty string'),
];
