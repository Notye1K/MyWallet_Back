import { movements, account, deleteTransaction, updateTransaction } from '../controllers/accountController.js'
import { Router } from 'express'
import validToken from '../middlewares/validToken.js'
import validSchema from '../middlewares/validSchema.js'
import schema from '../schemas/movementSchema.js'

const accountRouter = Router()

accountRouter.post('/movements', validSchema(schema), validToken, movements)
accountRouter.get('/account', validToken, account)
accountRouter.delete('/movements', validToken, deleteTransaction)
accountRouter.put('/movements', validSchema(schema), validToken, updateTransaction)

export default accountRouter
