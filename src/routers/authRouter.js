import { register, login } from '../controllers/authController.js'
import { Router } from 'express'
import validSchema from '../middlewares/validSchema.js'
import registerSchema from '../schemas/registerSchema.js'
import loginSchema from '../schemas/loginSchema.js'

const authRouter = Router()

authRouter.post('/register', validSchema(registerSchema), register)
authRouter.post('/login', validSchema(loginSchema), login)

export default authRouter