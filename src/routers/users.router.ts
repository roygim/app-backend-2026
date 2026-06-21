import { Router } from "express";
import * as usersService from "../services/users.service";
import { CreateUser, UpdateUser } from "../types/dto";
import registerValidation from "./middleware/register.validation";
import { ErrorType } from "../types";
import { tokenValidation } from "./middleware/token.validation";

const usersRouter = Router()

/**
 * @swagger
 * /users/register:
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
usersRouter.post("/register", registerValidation, async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const newUser: CreateUser = { firstname: firstname, lastname: lastname, email: email, password: password }

        const response = await usersService.register(newUser)

        if (!response.success) {
            res.status(400).send(response)
        } else {
            res.status(201).send(response);
        }
    } catch (err) {
        res.status(500).send('error');
    }
});

/**
 * @swagger
 * /users/login:
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
usersRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const response = await usersService.login(email, password)
        
        if (!response.success) {
            if (response.error == ErrorType.UserNotFound) {
                res.status(404).send({
                    error: ErrorType.UserNotFound,
                    message: 'User not found'
                })
            }
            else if (response.error == ErrorType.InvalidPassword) {
                res.status(400).send({
                    error: ErrorType.InvalidPassword,
                    message: 'Invalid password'
                })
            }
        } else {
            res.cookie('userToken', response.data.accessToken, { httpOnly: true })
            res.status(200).send(response)
        }
    } catch (err) {
        res.status(500).send('error');
    }
});

/**
 * @swagger
 * /users/logout:
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
usersRouter.delete("/logout", async (req, res) => {
    try {
        res.clearCookie('userToken')
        const response = {
            success: true,
            message: "user logout"
        }
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

/**
 * @swagger
 * /users/loaduser:
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
usersRouter.post("/loaduser", tokenValidation, async (req: any, res: any) => {
    try {
        const id = req.userId
        const response = await usersService.getUserById(id)
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

/**
 * @swagger
 * /users/all:
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
usersRouter.get("/all", async (req, res) => {
    try {
        const users = await usersService.getAll()
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send('error');
    }
});

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
usersRouter.put("/update/:userId", tokenValidation, async (req: any, res: any) => {
    try {
        const userId = parseInt(req.params.userId)
        const { firstname, lastname } = req.body

        const updateUser: UpdateUser = {
            firstname: firstname,
            lastname: lastname
        }

        const response = await usersService.update(userId, updateUser)

        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

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
usersRouter.delete("/delete/:userId", tokenValidation, async (req: any, res: any) => {
    try {
        const userId = parseInt(req.params.userId)

        const response = await usersService.deleteUser(userId)

        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

export default usersRouter
