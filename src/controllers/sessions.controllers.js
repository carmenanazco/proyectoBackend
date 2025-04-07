//negocio o controlador

import SessionsDaoMongo from "../daos/Mongo/sessions.dao.js";
import { generateToken } from "../utils/authToken.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

class SessionsController{
    constructor(){
        this.service = new SessionsDaoMongo()
    }

    register = async(req, res)=>{
        try {
            const { first_name, last_name, email, password } = req.body;
            if (!email || !password) return res.status(400).render('error', {error: 'email y password son obligatorios'})
            const userFound = await this.service.getUser(email)
            if(userFound) return res.status(401).render('error', { error: 'el email ya existe'})
    
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password)
            }

            const result = await this.service.createUser(newUser)
            res.render('login')
           // res.send({status: 'success', paylad: result})
    
        } catch (error) {
            console.log(error);
            
        }
    }
        

    login = async(req, res)=>{
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).render('error', {error: 'email y password son obligatorios'})
    
        const userFound = await this.service.getUser(email)
        if(!userFound) return res.status(401).render('error', {error: 'el usuario no existe'})
    
        if(!isValidPassword(password, { password: userFound.password })) return res.status(401).render('error', {error: 'el email o la contraseña no coinciden'})
    
        const token = generateToken({
            id: userFound._id,
            email: userFound.email,
            role: userFound.role,
            isAdmin: userFound.role == 'admin',
            carts: userFound.carts
        })
    
    const isAdmin=userFound.role == 'admin'
        res
        .cookie('coderCookieToken', token, {
            maxAge: 60*60*1000,
            httpOnly: true
    
        })
        .render('index', {usuario: userFound.toObject(), isAdmin})
        //.send({status: 'success', message: 'Logged success'})
    }

    logout = (req, res)=>{
        try {
            res.clearCookie('coderCookieToken').render('index')       
        } catch (error) {
            return res.render('error', {error:"Error al salir"});
        }
    }

    current = (req, res)=>{
        
        res.send({status: 'success', paylad: req.user})
    }
}

export default SessionsController