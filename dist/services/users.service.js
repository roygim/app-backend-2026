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
exports.deleteUser = exports.update = exports.getUserById = exports.login = exports.register = exports.getAll = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const usersRepository = __importStar(require("../repository/users.repository"));
const consts_1 = require("../consts");
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield usersRepository.getAll();
        const usersLight = users.map((user) => {
            delete user.password;
            return user;
        });
        const res = {
            success: true,
            data: usersLight
        };
        return res;
    }
    catch (err) {
        throw err;
    }
});
exports.getAll = getAll;
const register = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersRepository.getUserByEmail(newUser.email);
        if (user) {
            return {
                success: false,
                message: "user already exists",
                error: types_1.ErrorType.UserAlreadyExists
            };
        }
        const createdUser = yield usersRepository.addUser(newUser);
        delete createdUser.password;
        return {
            success: true,
            data: createdUser
        };
    }
    catch (err) {
        throw err;
    }
});
exports.register = register;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersRepository.getUserByEmail(email);
        if (user) {
            const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                return {
                    success: false,
                    message: "invalid password",
                    error: types_1.ErrorType.InvalidPassword
                };
            }
            delete user.password;
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, consts_1.JWT_SECRET_KEY);
            return {
                success: true,
                data: { user, accessToken }
            };
        }
        else {
            return {
                success: false,
                message: "user not found",
                error: types_1.ErrorType.UserNotFound
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.login = login;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersRepository.getUserById(id);
        if (user) {
            delete user.password;
            return {
                success: true,
                data: user
            };
        }
        else {
            return {
                success: false,
                message: "user not found",
                error: types_1.ErrorType.UserNotFound
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.getUserById = getUserById;
const update = (id, updateUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield usersRepository.updateUser(id, updateUser);
        if (user) {
            delete user.password;
            return {
                success: true,
                data: user
            };
        }
        else {
            return {
                success: false,
                message: "user not found",
                error: types_1.ErrorType.InternalError
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.update = update;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDelete = yield usersRepository.deleteUser(id);
        return {
            success: isDelete
        };
    }
    catch (err) {
        throw err;
    }
});
exports.deleteUser = deleteUser;
