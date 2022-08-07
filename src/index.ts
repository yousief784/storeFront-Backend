import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import router from './routes';
import swaggerDocs from './swagger.json';

const app: Application = express();
const port: number = parseInt(config.port as string) || 5000;

var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);
app.get('/', (_req: Request, res: Response): void => {
    res.status(200).json({
        status: 200,
        message: 'Welcome in our Application',
    });
});

app.listen(port, () => {
    console.log(`app run at port ${port}`);
});
export default app;
