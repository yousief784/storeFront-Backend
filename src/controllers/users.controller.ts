import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import UserModel from '../models/users.model';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../types/user.type';
const userModel = new UserModel();

class UserController {
    async index(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | object> {
        try {
            const getAllUsers = await userModel.index();
            if (!getAllUsers)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: getAllUsers,
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
    ): Promise<void | object> {
        try {
            const getUser = await userModel.show(req.params.user_name);
            if (!getUser)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: getUser,
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

            const { first_name, last_name, user_name, password } = req.body;

            const createNewUser = await userModel.create({
                first_name,
                last_name,
                user_name,
                password,
            });

            if (!createNewUser)
                res.status(400).json({
                    status: 400,
                    errorMessage: 'Not Found Data',
                });
            res.status(200).json({
                status: 200,
                data: createNewUser,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }

    async authenticate(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<object | undefined> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors });
            }
            const { user_name, password } = req.body;

            const getUserInfo = await userModel.authenticate(
                user_name,
                password
            );

            if (!getUserInfo)
                return res.status(400).json({
                    status: 400,
                    errorMessage: 'username or password is invalid',
                });

            const token = jwt.sign(
                { getUserInfo },
                config.tokenSecret as string
            );

            res.status(200).json({
                status: 200,
                data: { ...getUserInfo, token },
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;
