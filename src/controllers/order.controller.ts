import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import OrderModel from '../models/orders.model';
import config from '../config';

const orderModel = new OrderModel();

class OrderController {
    async addProductToOrderForAuthUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors);
            }

            const authHeader = req.get('Authorization');
            const token = authHeader?.split(' ')[1];
            const decode = jwt.verify(
                token as string,
                config.tokenSecret as string
            );
            const userId = Object.assign(decode as object).getUserInfo.id;

            const { product_id, quantity } = req.body;

            const getOrders =
                await orderModel.addProductToOrderDependOnAuthUser(
                    {
                        product_id,
                        quantity,
                    },
                    userId
                );
            res.status(200).json({
                status: 200,
                data: getOrders,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }

    // get All products in active orders
    async getOrderByStatusDependOnAuthUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const authHeader = req.get('Authorization');
            const token = authHeader?.split(' ')[1];
            const decode = jwt.verify(
                token as string,
                config.tokenSecret as string
            );
            const userId = Object.assign(decode as object).getUserInfo.id;
            const getOrders = await orderModel.getOrderByStatusDependOnAuthUser(
                userId,
                req.params.status
            );
            if (getOrders) {
                res.status(200).json({
                    status: 200,
                    data: getOrders,
                    message: 'success',
                });
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'order Not Found',
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async purchaseDependOnAuthUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<object | undefined> {
        try {
            const authHeader = req.get('Authorization');
            const token = authHeader?.split(' ')[1];
            const decode = jwt.verify(
                token as string,
                config.tokenSecret as string
            );
            const userId = Object.assign(decode as object).getUserInfo.id;

            const purchase = await orderModel.purchaseDependOnAuthUser(userId);
            if (!purchase) {
                return res.status(400).json({
                    status: 400,
                    message: 'order Not Found',
                });
            }
            res.status(200).json({
                status: 200,
                data: purchase,
                message: 'success',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default OrderController;
