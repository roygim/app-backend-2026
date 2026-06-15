"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_router_1 = __importDefault(require("./users.router"));
const routers = (0, express_1.Router)();
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
routers.get('/healthz', (req, res) => { return res.status(200).json('ok'); });
routers.use(users_router_1.default);
exports.default = routers;
