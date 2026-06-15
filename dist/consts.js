"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET_KEY = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
exports.PORT = PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || '';
exports.JWT_SECRET_KEY = JWT_SECRET_KEY;
