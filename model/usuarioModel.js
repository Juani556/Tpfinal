
class UsuarioModel {

    constructor() {
        this.usuarios = [

        ]
    }


    guardarUsuario = async (usuario) => {

        usuario.id = (this.usuarios[this.usuarios.length - 1]?.id || 0) + 1
        this.usuarios.push(usuario)
        return usuario
    }

    obtenerUsuario = async (username) => {
        return this.usuarios.find((usuario) => usuario.username === username)
    }

}

export default UsuarioModel