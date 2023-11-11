import express from 'express'
import LoginRouter from './router/loginRouter.js'
import Router from './router/router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("", new LoginRouter().start())
app.use("", new Router().start())

app.listen("8080", () => console.log("Escuchando en puerto 8080"))
