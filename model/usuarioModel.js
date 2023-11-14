import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const Usuario = mongoose.model('usuario', userSchema)

export default Usuario