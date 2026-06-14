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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUserById = exports.getUserByEmail = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany();
        return users;
    }
    catch (err) {
        throw err;
    }
});
exports.getAll = getAll;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.users.findUnique({
            where: {
                email,
            },
        });
        return user !== null && user !== void 0 ? user : null;
    }
    catch (err) {
        throw err;
    }
});
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.users.findUnique({
            where: {
                id,
            },
        });
        return user !== null && user !== void 0 ? user : null;
    }
    catch (err) {
        throw err;
    }
});
exports.getUserById = getUserById;
const addUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 12);
        const createdUser = yield prisma.users.create({
            data: Object.assign(Object.assign({}, newUser), { password: hashedPassword })
        });
        return createdUser;
    }
    catch (err) {
        throw err;
    }
});
exports.addUser = addUser;
const updateUser = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield prisma.users.update({
            where: {
                id: id
            },
            data: Object.assign({}, user)
        });
        return updatedUser;
    }
    catch (err) {
        throw err;
    }
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield prisma.users.delete({
            where: {
                id: id
            }
        });
        return deletedUser ? true : false;
    }
    catch (err) {
        throw err;
    }
});
exports.deleteUser = deleteUser;
