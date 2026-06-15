import { z } from "zod"
import { emailRegex } from "../../utils/regex"

const BodySchema = z.object({
    email: z
        .string()
        .nonempty()
        .refine((val) => emailRegex.test(val), { message: 'invalid email' }),
    firstname: z
        .string({ required_error: 'firstname is required' })
        .min(2, { message: 'firstname is minimum 2 letters' }),
    lastname: z
        .string({ required_error: 'lastname is required' })
        .min(2, { message: 'lastname is minimum 2 letters' }),
    password: z
        .string({ required_error: 'password is required' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/, {
            message: 'password must be 8-12 characters and include a letter, a number, and a special character (@$!%*#?&)'
        })
})

const registerValidation = async (req: any, res: any, next: any) => {
    try {
        await BodySchema.parseAsync(req.body)
        next()
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json(err.errors[0].message)
        } else {
            return res.status(400).json('error')
        }
    }
}

export default registerValidation