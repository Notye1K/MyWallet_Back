import { stripHtml } from "string-strip-html"
import { v4 } from "uuid"
import bcrypt from "bcrypt"
import {userCollection, tokenCollection} from '../db.js'

export async function register (req, res) {
    try {
        const user = await userCollection.findOne({ email: req.body.email })
        if (user) {
            return res.status(409).send('Email already registered')
        }

        const password = bcrypt.hashSync(req.body.password, 10)
        await userCollection.insertOne({ ...req.body, password })
        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function login (req, res) {
    try {
        const user = await userCollection.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send('Email not found')
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).send('Password incorrect')
        }

        const token = v4()
        await tokenCollection.insertOne({ token, userId: user._id })

        res.status(202).send(token)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}