import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 4002
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ''

export {
    PORT,
    JWT_SECRET_KEY
}