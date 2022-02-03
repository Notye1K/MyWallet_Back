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
await mongoClient.connect()
const db = mongoClient.db('MyWallet')
const userCollection = db.collection('Users')
const tokenCollection = db.collection('Tokens')


server.post('/register', async (req, res) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const validation = schema.validate(req.body, { abortEarly: false })
    try {
        if(validation.error){
            return res.status(422).send(validation.error.details.map(v => v.message))
        }
        const user = await userCollection.findOne({email: req.body.email})
        if(user){
            return res.status(409).send('Email already registered')
        }

        const password = bcrypt.hashSync(req.body.password, 10)
        await userCollection.insertOne({ ...req.body, password})
        res.sendStatus(201)
        
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

server.post('/login', async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const validation = schema.validate(req.body, { abortEarly: false })
    try {
        if (validation.error) {
            return res.status(422).send(validation.error.details.map(v => v.message))
        }
        const user = await userCollection.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send('Email not found')
        }
        if (!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).send('Password incorrect')
        }

        const token = v4()
        await tokenCollection.insertOne({token, userId: user._id})
        
        res.status(202).send(token)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

server.listen(5000,() => console.log('ready'))