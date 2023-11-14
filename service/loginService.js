import UsuarioDAO from "../model/usuarioDAO.js"
import cuentaService from "./cuentaService.js"
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

class LoginService {

    constructor() {
        this.usuarioDAO = new UsuarioDAO()
        this.cuentaService = cuentaService
    }

    registrarUsuario = async (usuario) => {
        usuario.password = await this.encriptarPassword(usuario.password)
        const response = await this.usuarioDAO.guardarUsuario(usuario)
        this.cuentaService.crearCuenta(response)
        return response
        
    }

    login = async (loginRequest) => {
        const usuario = await this.usuarioDAO.obtenerUsuario(loginRequest.username)
        if (await this.verificarPassword(loginRequest.password, usuario.password)) {
            return this.generateToken(usuario._id)
        } else {
            return ""
        }
        
    }

    async encriptarPassword(password) {
        return await bcrypt.hash(password, 10)
    }

    async verificarPassword(password, hash) {
        return await bcrypt.compare(password, hash)
    }

    generateToken(id) {
        return jsonwebtoken.sign({
            data: {
                user: id
            }
        }, "key", {
            expiresIn: 120
        })
    }

    randomNumber(length) {
        return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
    }
}

export default LoginService