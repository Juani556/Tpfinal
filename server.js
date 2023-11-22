import express from 'express'
import LoginRouter from './router/loginRouter.js'
import Router from './router/router.js'
import swagger from 'swagger-ui-express'
import swaggerFile from './swagger/openapi.json' assert {type: 'json'}
import mongoose from 'mongoose'

const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/banco").then(() => console.log("Conectado a la base")).catch(err => console.log(err))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/docs", swagger.serve, swagger.setup(swaggerFile))

app.use("", new LoginRouter().start())
app.use("", new Router().start())



app.listen("8080", () => console.log("Escuchando en puerto 8080"))
