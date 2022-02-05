import { movements, account } from '../controllers/accountController.js'
import { Router } from 'express'
import validToken from '../middlewares/validToken.js'
import validSchema from '../middlewares/validSchema.js'
import schema from '../schemas/movementSchema.js'

const accountRouter = Router()

accountRouter.post('/movements', validSchema(schema), validToken, movements)
accountRouter.get('/account', validToken, account)

export default accountRouter
