import express, { json } from "express"
import cors from "cors"
import authRouter from './routers/authRouter.js'
import accountRouter from './routers/accountRouter.js'

const server = express()
server.use(json())
server.use(cors())

server.use(authRouter)
server.use(accountRouter)

server.listen(process.env.PORT, () => console.log('ready'))