"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const consts_1 = require("./consts");
const routers_1 = __importDefault(require("./routers"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
const corsConfig = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3001',
    ],
    credentials: true
};
app.use((0, cors_1.default)(corsConfig));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: '1mb' }));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, swagger_1.swaggerUiOptions));
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.swaggerSpec);
});
app.use('/api', routers_1.default);
app.listen(consts_1.PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${consts_1.PORT}`);
});
