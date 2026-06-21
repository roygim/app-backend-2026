import { Router } from "express";
import usersRouter from "./users.router";

const routers = Router()

/**
 * @swagger
 * /healthz:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: ok
 */
routers.get('/healthz', (req, res) => { return res.status(200).json('ok') })

routers.use('/users', usersRouter)

export default routers