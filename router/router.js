import express from 'express'
import authenticationFilter from '../security/authenticationFilter.js'
import MovimientoController from '../controller/movimientoController.js'

class Router {

    constructor() {
        this.router = express.Router()
        this.controller = new MovimientoController()
    }

    start() {

        this.router.use(authenticationFilter)
        this.router.post('/ingresar', this.controller.ingresarPesos)
        this.router.post('/transferir', this.controller.transferir)

        return this.router
    }
}

export default Router