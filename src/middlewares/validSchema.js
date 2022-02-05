export default function validSchema (schema){
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false })
        if (validation.error) {
            return res.status(422).send(validation.error.details.map(v => v.message))
        }
        next()
    }
}