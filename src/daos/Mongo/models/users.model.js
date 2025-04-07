import { Schema, model } from "mongoose";

const usersCollection = 'users'
const usersSchema = new Schema({
    first_name: String,
    last_name: String,
    full_name: String,
    
    email:{
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    carts: {type: Schema.Types.ObjectId, ref: 'carts'}
})

export const userModel = model(usersCollection, usersSchema)
//registran -> 
// crear el usuario -> 
// crear un carrito 
//-> asignar el id del carrito al usuario que se esta registrando