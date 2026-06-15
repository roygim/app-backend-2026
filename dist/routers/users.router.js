"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersService = __importStar(require("../services/users.service"));
const register_validation_1 = __importDefault(require("./middleware/register.validation"));
const types_1 = require("../types");
const token_validation_1 = require("./middleware/token.validation");
const usersRouter = (0, express_1.Router)();
/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseError'
 */
usersRouter.post("/register", register_validation_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password } = req.body;
    try {
        const newUser = { firstname: firstname, lastname: lastname, email: email, password: password };
        const response = yield usersService.register(newUser);
        if (!response.success) {
            res.status(400).send(response);
        }
        else {
            res.status(201).send(response);
        }
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Login and receive userToken cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful — sets httpOnly userToken cookie
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: userToken=<jwt>; Path=/; HttpOnly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken: { type: string }
 *       400:
 *         description: Invalid password
 *       404:
 *         description: User not found
 */
usersRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const response = yield usersService.login(email, password);
        if (!response.success) {
            if (response.error == types_1.ErrorType.UserNotFound) {
                res.status(404).send({
                    error: types_1.ErrorType.UserNotFound,
                    message: 'User not found'
                });
            }
            else if (response.error == types_1.ErrorType.InvalidPassword) {
                res.status(400).send({
                    error: types_1.ErrorType.InvalidPassword,
                    message: 'Invalid password'
                });
            }
        }
        else {
            res.cookie('userToken', response.data.accessToken, { httpOnly: true });
            res.status(200).send(response);
        }
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
/**
 * @swagger
 * /logout:
 *   delete:
 *     tags: [Users]
 *     summary: Clear userToken cookie
 *     responses:
 *       200:
 *         description: Cookie cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: user logout }
 */
usersRouter.delete("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('userToken');
        const response = {
            success: true,
            message: "user logout"
        };
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
/**
 * @swagger
 * /loaduser:
 *   post:
 *     tags: [Users]
 *     summary: Get current user from token cookie
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No token cookie
 *       403:
 *         description: Invalid or expired token
 */
usersRouter.post("/loaduser", token_validation_1.tokenValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.userId;
        const response = yield usersService.getUserById(id);
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Array of users (passwords omitted)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
usersRouter.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield usersService.getAll();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
/**
 * @swagger
 * /users/update/{userId}:
 *   put:
 *     tags: [Users]
 *     summary: Update user fields
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No token cookie
 *       403:
 *         description: Invalid or expired token
 */
usersRouter.put("/users/update/:userId", token_validation_1.tokenValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const { firstname, lastname, email } = req.body;
        const updateUser = {
            firstname: firstname,
            lastname: lastname,
            email: email
        };
        const response = yield usersService.update(userId, updateUser);
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
/**
 * @swagger
 * /users/delete/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *       401:
 *         description: No token cookie
 *       403:
 *         description: Invalid or expired token
 */
usersRouter.delete("/users/delete/:userId", token_validation_1.tokenValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId);
        const response = yield usersService.deleteUser(userId);
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send('error');
    }
}));
exports.default = usersRouter;
