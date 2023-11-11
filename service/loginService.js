import UsuarioModel from "../model/usuarioModel.js"
import bcrypt from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

class LoginService {

    constructor() {
        this.model = new UsuarioModel()
    }

    registrarUsuario = async (usuario) => {
        usuario.password = await this.encriptarPassword(usuario.password)
        return await this.model.guardarUsuario(usuario)
    }

    login = async (loginRequest) => {
        const usuario = await this.model.obtenerUsuario(loginRequest.username)
        if (await this.verificarPassword(loginRequest.password, usuario.password)) {
            return this.generateToken(loginRequest.username)
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

    generateToken(username) {
        return jsonwebtoken.sign({
            data: {
                username: username
            }
        }, "key", {
            expiresIn: 120
        })
    }
}

export default LoginService