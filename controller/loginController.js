import LoginService from "../service/loginService.js"

class LoginController {

    constructor() {
        this.service = new LoginService()
    }

    registrarUsuario = async (req, res) => {
        res.json( await this.service.registrarUsuario(req.body))
    }
    
    login = async (req, res) => {
        res.json( {
            token: await this.service.login(req.body)
        })
    }

    
}

export default LoginController