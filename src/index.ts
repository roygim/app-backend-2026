import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet"
import { PORT } from "./consts";
import routers from "./routers"
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerUiOptions } from './swagger';

const app: Express = express();

const corsConfig = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3001',
    ],
    credentials: true
}

app.use(cors(corsConfig))

app.use(helmet())

app.use(cookieParser());

app.use(bodyParser.json({ limit: '1mb' }))

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api', routers)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});