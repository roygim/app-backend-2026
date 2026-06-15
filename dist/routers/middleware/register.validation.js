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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const regex_1 = require("../../utils/regex");
const BodySchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .nonempty()
        .refine((val) => regex_1.emailRegex.test(val), { message: 'invalid email' }),
    firstname: zod_1.z
        .string({ required_error: 'firstname is required' })
        .min(2, { message: 'firstname is minimum 2 letters' }),
    lastname: zod_1.z
        .string({ required_error: 'lastname is required' })
        .min(2, { message: 'lastname is minimum 2 letters' }),
    password: zod_1.z
        .string({ required_error: 'password is required' }).min(4, { message: 'password is minimum 4 letters' })
});
const registerValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield BodySchema.parseAsync(req.body);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            return res.status(400).json(err.errors[0].message);
        }
        else {
            return res.status(400).json('error');
        }
    }
});
exports.default = registerValidation;
