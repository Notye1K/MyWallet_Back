import {tokenCollection} from '../db.js'

export default async function validToken (req, res, next){
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
        return res.status(401).send('Missing token')
    }

    const tokenId = await tokenCollection.findOne({ token })
    if (!tokenId) {
        return res.status(401).send('Invalid token')
    }
    res.locals.tokenId = tokenId
    next()
}