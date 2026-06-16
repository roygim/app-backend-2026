import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../../consts'
import crypto from 'crypto'

export const tokenValidation = async (req: any, res: any, next: any) => {
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

        const key = crypto.createHash('sha256').update(JWT_SECRET_KEY, 'utf8').digest()

        jwt.verify(token, key, { algorithms: ['HS256'] }, (err: any, payload: any) => {
            if (err) return res.sendStatus(403)
            req.userId = payload.userId
            next()
        })

        // jwt.verify(token, JWT_SECRET_KEY, (err: any, payload: any) => {
        //     if (err) return res.sendStatus(403)
        //     req.userId = payload.userId
        //     next()
        // })
    } else {
        return res.sendStatus(401)
    }
}