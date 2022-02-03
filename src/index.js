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
const movementsCollection = db.collection('Movements')


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

server.post('/movements', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const schema = joi.object({
        description: joi.string().required(),
        value: joi.number().precision(2).required()
    })
    const validation = schema.validate(req.body, { abortEarly: false })
    try {
        if (validation.error) {
            return res.status(422).send(validation.error.details.map(v => v.message))
        }
        if (!token){
            return res.status(401).send('Missing token')
        }
    
        const tokenId = await tokenCollection.findOne({ token })
        if (!tokenId) {
            return res.status(401).send('Invalid token')
        }

        await userCollection.updateOne({_id: tokenId.userId}, {$push: {movements: req.body}})

        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

server.get('/account', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    try {
        if (!token) {
            return res.status(401).send('Missing token')
        }

        const tokenId = await tokenCollection.findOne({ token })
        if (!tokenId) {
            return res.status(401).send('Invalid token')
        }

        const user = await userCollection.findOne({ _id: tokenId.userId })
        delete user._id
        delete user.email
        delete user.password

        res.status(200).send(user)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }})

server.listen(5000,() => console.log('ready'))