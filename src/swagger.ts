import swaggerJsdoc from 'swagger-jsdoc';

const definition: swaggerJsdoc.OAS3Definition = {
    openapi: '3.0.3',
    info: {
        title: 'App Backend API - Nodejs',
        version: '1.0.0',
        description: 'User management API',
    },
    servers: [{ url: 'http://localhost:4002/api' }],
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
                    password: { type: 'string', minLength: 8, maxLength: 12, example: 'zaq1@WSXZ', description: 'Must include a letter, a number, and a special character (@$!%*#?&)' },
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

export const swaggerSpec = swaggerJsdoc({
    definition,
    apis: ['./src/routers/*.ts'],
});

export const swaggerUiOptions = {};
