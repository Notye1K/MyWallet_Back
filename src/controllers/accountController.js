import { stripHtml } from "string-strip-html"
import { userCollection } from '../db.js'
import { v4 } from "uuid"
import dayjs from 'dayjs'


export async function movements (req, res) {
    try {
        const tokenId = res.locals.tokenId
        const time = dayjs().format('MM/DD')
        const id = v4()
        await userCollection.updateOne({ _id: tokenId.userId }, { $push: { movements: { ...req.body, time, id } } })

        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function account (req, res) {
    try {
        const tokenId = res.locals.tokenId
        const user = await userCollection.findOne({ _id: tokenId.userId })
        delete user._id
        delete user.email
        delete user.password

        res.status(200).send(user)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}