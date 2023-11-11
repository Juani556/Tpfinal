import express from 'express'
import authenticationFilter from '../security/authenticationFilter.js'

class Router {

    constructor() {
        this.router = express.Router()
    }

    start() {

        this.router.use(authenticationFilter)
        this.router.get('/test', (req, res) => {
            res.json("Hola")
        })

        return this.router
    }
}

export default Router