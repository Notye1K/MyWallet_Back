import joi from "joi"

const schema = joi.object({
    description: joi.string().required(),
    value: joi.number().precision(2).required()
})

export default schema