import { Router } from "express";
import * as usersService from "../services/users.service";
import { CreateUser, UpdateUser } from "../types/dto";
import registerValidation from "./middleware/register.validation";
import { ErrorType } from "../types";
import { tokenValidation } from "./middleware/token.validation";

const usersRouter = Router()

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

usersRouter.post("/loaduser", tokenValidation, async (req: any, res: any) => {
    try {
        const id = req.userId
        const response = await usersService.getUserById(id)
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

usersRouter.get("/users", async (req, res) => {
    try {
        const users = await usersService.getAll()
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send('error');
    }
});

usersRouter.put("/users/update/:userId", tokenValidation, async (req: any, res: any) => {
    try {
        const userId = parseInt(req.params.userId)
        const { firstname, lastname, email } = req.body

        const updateUser: UpdateUser = {
            firstname: firstname,
            lastname: lastname,
            email: email
        }

        const response = await usersService.update(userId, updateUser)

        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

usersRouter.delete("/users/delete/:userId", tokenValidation, async (req: any, res: any) => {
    try {
        const userId = parseInt(req.params.userId)

        const response = await usersService.deleteUser(userId)

        res.status(200).send(response)
    } catch (err) {
        res.status(500).send('error');
    }
});

export default usersRouter
