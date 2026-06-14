"use strict";
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
exports.tokenValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const consts_1 = require("../../consts");
const tokenValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    // if (token == null) return res.sendStatus(401)
    // jwt.verify(token, JWT_SECRET_KEY, (err: any, payload: any) => {
    //     if (err) return res.sendStatus(403)
    //     req.userId = payload.userId
    //     next()
    // })
    if (req.cookies && req.cookies.userToken) {
        const token = req.cookies.userToken;
        jsonwebtoken_1.default.verify(token, consts_1.JWT_SECRET_KEY, (err, payload) => {
            if (err)
                return res.sendStatus(403);
            req.userId = payload.userId;
            next();
        });
    }
    else {
        return res.sendStatus(401);
    }
});
exports.tokenValidation = tokenValidation;
