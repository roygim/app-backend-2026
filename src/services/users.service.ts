import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ErrorType, ResponseObj, User } from "../types";
import { CreateUser, UpdateUser } from "../types/dto";
import * as usersRepository from "../repository/users.repository";
import { JWT_SECRET_KEY } from '../consts';
import crypto from 'crypto'

export const getAll = async (): Promise<ResponseObj<User[]>> => {
    try {
        const users: User[] = await usersRepository.getAll()
        
        const usersLight = users.map((user) => {
            delete (user as { password?: string }).password
            return user
        })

        const res: ResponseObj<User[]> = {
            success: true,
            data: usersLight
        };

        return res
    } catch (err) {
        throw err
    }
}

export const register = async (newUser: CreateUser): Promise<ResponseObj<User>> => {
    try {
        const user: User | null = await usersRepository.getUserByEmail(newUser.email)

        if (user) {
            return {
                success: false,
                message: "user already exists",
                error: ErrorType.UserAlreadyExists
            }
        }

        const createdUser: User = await usersRepository.addUser(newUser)

        delete (createdUser as { password?: string }).password

        return {
            success: true,
            data: createdUser
        }
    } catch (err) {
        throw err
    }
}

export const login = async (email: string, password: string): Promise<ResponseObj<any>> => {
    try {
        const user: User | null = await usersRepository.getUserByEmail(email)

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return {
                    success: false,
                    message: "invalid password",
                    error: ErrorType.InvalidPassword
                }
            }

            delete (user as { password?: string }).password

            const key = crypto.createHash('sha256').update(JWT_SECRET_KEY, 'utf8').digest()

            const accessToken = jwt.sign({ userId: user.id }, key, { algorithm: 'HS256' })
            // const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET_KEY)

            return {
                success: true,
                data: { user, accessToken }
            }
        } else {
            return {
                success: false,
                message: "user not found",
                error: ErrorType.UserNotFound
            }
        }
    } catch (err) {
        throw err
    }
}

export const getUserById = async (id: number): Promise<ResponseObj<User>> => {
    try {
        const user: User | null = await usersRepository.getUserById(id)

        if (user) {
            delete (user as { password?: string }).password

            return {
                success: true,
                data: user
            }
        } else {
            return {
                success: false,
                message: "user not found",
                error: ErrorType.UserNotFound
            }
        }
    } catch (err) {
        throw err
    }
}

export const update = async (id: number, updateUser: UpdateUser): Promise<ResponseObj<User>> => {
    try {
        const user: User = await usersRepository.updateUser(id, updateUser)

        if (user) {
            delete (user as { password?: string }).password

            return {
                success: true,
                data: user
            }
        } else {
            return {
                success: false,
                message: "user not found",
                error: ErrorType.InternalError
            }
        }
    } catch (err) {
        throw err
    }
}

export const deleteUser = async (id: number): Promise<ResponseObj<any>> => {
    try {
        const isDelete = await usersRepository.deleteUser(id)

        return {
            success: isDelete
        }
    } catch (err) {
        throw err
    }
}