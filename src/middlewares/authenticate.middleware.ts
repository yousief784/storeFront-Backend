import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

const validTokenMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): object | undefined => {
    try {
        const authHeader = req.get('Authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const decode = jwt.verify(token, config.tokenSecret as string);
                if (decode) {
                    next();
                } else {
                    return res.status(401).json({
                        status: 401,
                        errorMessage: 'Try Login Again!!',
                    });
                }
            } else {
                return res.status(401).json({
                    status: 401,
                    errorMessage: 'Try Login Again!!',
                });
            }
        } else {
            return res.status(401).json({
                status: 401,
                errorMessage: 'Try Login Again!!',
            });
        }
    } catch (error) {
        return res.status(401).json({
            status: 401,
            errorMessage: 'Try Login Again!!',
        });
    }
};

export default validTokenMiddleware;
