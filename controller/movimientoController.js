import cuentaService from "../service/cuentaService.js"


class MovimientoController {
    constructor() {
        this.service = cuentaService
    }

    transferir = async (req, res) => {
        res.json(await this.service.transferirPesos(req.body))
    }

    ingresarPesos = async (req, res) => {
        await this.service.ingresarPesos(req.body)
        res.end()
    }
}

export default MovimientoController