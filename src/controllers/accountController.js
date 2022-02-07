import { stripHtml } from "string-strip-html"
import { userCollection } from '../db.js'
import { v4 } from "uuid"
import dayjs from 'dayjs'


export async function movements(req, res) {
    try {
        const tokenId = res.locals.tokenId
        const time = dayjs().format('MM/DD')
        const id = v4()
        const description = stripHtml(req.body.description).result.trim()
        await userCollection.updateOne({ _id: tokenId.userId }, { $push: { movements: {
            ...req.body, time, id, description
        } } })

        res.sendStatus(201)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function account(req, res) {
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

export async function deleteTransaction(req, res) {
    try {
        const tokenId = res.locals.tokenId
        const transactionId = req.query.transactionId
        const ids = await userCollection.findOne({ _id: tokenId.userId }, { movements: { id: 1 } })

        if (!transactionId || !ids.movements.find(v => v.id === transactionId)) {
            return res.sendStatus(404)
        }

        await userCollection.updateOne({ _id: tokenId.userId }, { $pull: { movements: { id: transactionId } } })

        res.sendStatus(200)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}

export async function updateTransaction(req, res) {
    try {
        const tokenId = res.locals.tokenId
        const transactionId = req.query.transactionId
        const ids = await userCollection.findOne({ _id: tokenId.userId }, { movements: { id: 1 } })

        if (!transactionId || !ids.movements.find(v => v.id === transactionId)) {
            return res.sendStatus(404)
        }

        const description = stripHtml(req.body.description).result.trim()
        await userCollection.updateOne({ _id: tokenId.userId, 'movements.id': transactionId }, {
            $set: {
                'movements.$.description': description,
                'movements.$.value': req.body.value
            }
        })

        res.sendStatus(200)

    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
}