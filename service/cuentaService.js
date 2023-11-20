import cuentaDAO from "../model/cuentaDAO.js"
import {generate} from "random-words"

class CuentaService {

    constructor() {
        this.cuentaDao = cuentaDAO
    }

    crearCuenta = async (usuario) => {

        await this.cuentaDao.crearCuenta({
            usuario: usuario,
            saldoPesos: 0,
            saldoDolares: 0,
            alias: this.generarAlias(),
            cbu: this.generarCbu().padStart(22, "0")
        })
    }

    transferirPesos = async (request) => {
        const cuentaOrigen = await this.cuentaDao.obtenerCuentaPorUsuario(request.user)

        if (cuentaOrigen.saldoPesos < request.monto) {
            return {error: "No tenes suficientes fondos"}
        }

        let cuentaDestino

        if (request.alias) {
            cuentaDestino = await this.cuentaDao.obtenerCuentaPorAlias(request.alias)
        } else {
            cuentaDestino = await this.cuentaDao.obtenerCuentaPorCbu(request.cbu)
        }

        if (!cuentaDestino) {
            return {error: "Cuenta destino no existente"}
        }

        cuentaOrigen.saldoPesos -= request.monto
        cuentaDestino.saldoPesos += request.monto
        
        cuentaOrigen.movimientos.push({
            monto: request.monto * -1,
            moneda: "$",
            destinatario: cuentaDestino.cbu,
            descripcion: `Transferencia saliente a ${cuentaDestino.cbu}`
        })

        cuentaDestino.movimientos.push({
            monto: request.monto,
            moneda: "$",
            descripcion: `Transferencia entrante de ${cuentaOrigen.cbu}`
        })

        cuentaOrigen.save()
        cuentaDestino.save()


    }

    ingresarPesos = async (request) => {
        const cuenta = await this.cuentaDao.obtenerCuentaPorUsuario(request.user)
        cuenta.saldoPesos += request.monto
        cuenta.movimientos.push({
            monto: request.monto,
            moneda: "$",
            descripcion: request.descripcion || "Ingreso de dinero"
        })
        cuenta.save()
    }   
    
    comprarDolares = async (request) => {
        const { compra: precioDolar } = await this.obtenerPrecioDolar()
        const cuenta = await this.cuentaDao.obtenerCuentaPorUsuario(request.user)

        if (cuenta.saldoPesos >= request.monto) {
            const dolaresMonto = this.convertirPesosADolares(request.monto, precioDolar)

            // Actualizar saldos
            cuenta.saldoDolares += dolaresMonto;
            cuenta.saldoPesos -= request.monto;

            cuenta.movimientos.push({
                monto: dolaresMonto,
                moneda: "USD",
                descripcion: request.descripcion || "Compra de dolares"
            })
            await cuenta.save()
        } else {
            return "Saldo insuficiente"
        }
    };
    
    obtenerPrecioDolar = async () => {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result[0];
    };
    
    convertirPesosADolares = (montoPesos, precioDolar) => {
        return montoPesos / precioDolar;
    };

    generarCbu() {
        return Math.floor(Math.random() * Math.pow(10, 11)).toString() + Math.floor(Math.random() * Math.pow(10, 11)).toString()
    }

    generarAlias() {
        return generate({exactly: 3, minLength: 4, maxLength: 5, 
        formatter: (word) => word.toUpperCase()}).join(".")
    }
}

const cuentaService = new CuentaService()

export default cuentaService