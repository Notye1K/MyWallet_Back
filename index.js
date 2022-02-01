import express, {json}  from "express"
import cors from "cors"
import {Mongodb} from "mongodb"
import joi from "joi"
import dotenv from "dotenv"
import { stripHtml } from "string-strip-html"


dotenv.config()
const server = express()
server.use(json())
server.use(cors())

server.listen(5000,() => console.log('ready'))