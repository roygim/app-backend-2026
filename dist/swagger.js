"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiOptions = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const definition = {
    openapi: '3.0.3',
    info: {
        title: 'App Backend API',
        version: '1.0.0',
        description: 'User management API',
    },
    servers: [{ url: 'http://localhost:8002/api' }],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'userToken',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    firstname: { type: 'string', nullable: true, example: 'John' },
                    lastname: { type: 'string', nullable: true, example: 'Doe' },
                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                },
            },
            CreateUserRequest: {
                type: 'object',
                required: ['email', 'password', 'firstname', 'lastname'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 4 },
                    firstname: { type: 'string', minLength: 2 },
                    lastname: { type: 'string', minLength: 2 },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                },
            },
            UpdateUserRequest: {
                type: 'object',
                properties: {
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                },
            },
            ResponseError: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string' },
                    message: { type: 'string' },
                },
            },
        },
    },
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition,
    apis: ['./src/routers/*.ts'],
});
exports.swaggerUiOptions = {};
