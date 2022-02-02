import express, {json}  from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import joi from "joi"
import dotenv from "dotenv"
import { stripHtml } from "string-strip-html"
import bcrypt from "bcrypt"
import { v4 } from "uuid"


dotenv.config()
const server = express()
server.use(json())
server.use(cors())

const mongoClient = new MongoClient(process.env.MONGO_URI)
let db
mongoClient.connect(() => {
    db = mongoClient.db('MyWallet')
})
const userCollection = db.collection('Users')


server.post('/accounts', async (req, res) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().email().required()
    })
    const validation = schema.validate(req.body, { abortEarly: false })
    try {
        if(validation.error){
            return res.status(422).send(validation.error.details.map(v => v.message))
        }

        const password = bcrypt.hashSync(req.body.password, 10)
        await userCollection.insetOne({ ...req.body, password})
        
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

server.listen(5000,() => console.log('ready'))