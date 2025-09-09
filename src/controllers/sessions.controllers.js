//negocio o controlador

import SessionsDaoMongo from "../daos/Mongo/sessions.dao.js";
import { generateToken } from "../utils/authToken.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import jwt from 'jsonwebtoken';
import { configObject } from '../config/index.js'


const PRIVATE_KEY = configObject.privateKey


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
            res.status(201).json({ message: "Usuario registrado exitosamente", user: result });
            //res.render('login')
           // res.send({status: 'success', paylad: result})
    
        } catch (error) {
            console.log(error);
            
        }
    }
        

    login = async(req, res)=>{
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({error: 'email y password son obligatorios'})
    
        const userFound = await this.service.getUser(email)
        if(!userFound) return res.status(401).json({error: 'el usuario no existe'})
    
        if(!isValidPassword(password, { password: userFound.password })) return res.status(401).json({error: 'el email o la contraseña no coinciden'})
        
        const token = generateToken({
                id: userFound._id,
                email: userFound.email,
                role: userFound.role,
                carts: userFound.carts
        })

    res
    .cookie('coderCookieToken', token, {
        maxAge: 60*60*1000,
        httpOnly: true,
        secure: false,      // ⚠️ en producción true (https), en local false
        sameSite: "Lax",
        path: "/"
    })
    .send({status: 'success', message:  `¡Bienvenido/a ${userFound.first_name}!`})

}
        // Crear JWT
        /*const token = jwt.sign(
            { id: userFound._id, email: userFound.email },
            'PRIVATE_KEY',
            { expiresIn: '2h' }
        );*/

        // Guardar el token en cookie
        /*res.cookie('coderCookieToken', token, {
            httpOnly: true,
            secure: false, // ⚠️ true en producción con HTTPS
            sameSite: 'Lax',
        });
        
        res.json({ message: 'Logged success' });*/

        /* const token = generateToken({
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
            httpOnly: true,
            secure: false, 
            sameSite: "Strict" 
        })*/
        //.render('index', {usuario: userFound.toObject(), isAdmin})
        //.json({ usuario: userFound.toObject(), isAdmin });

        //.send({status: 'success', message: 'Logged success'})


    callback=(req, res) => {
        const user = req.user
        const token = jwt.sign({ ...user }, configObject.privateKey, { expiresIn: '1d' })

        res.cookie('coderCookieToken', token, {
            httpOnly: true,
            secure: false, // Cambia a true en producción con HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.redirect('http://localhost:5501/pages/productos.html'); 
    }

    logout = (req, res)=>{
        try {
            res.clearCookie('coderCookieToken').render('index')       
        } catch (error) {
            return res.render('error', {error:"Error al salir"});
        }
    }

    current = (req, res)=>{
        
        res.send({status: 'success', payload: req.user})
    }

    perfil = (req, res)=>{
        console.log('token', req.cookies);

        const token = req.cookies.token;
        console.log(token);
        
        if (!token) return res.status(401).json({ error: 'No autorizado' });

        try {
            const decoded = jwt.verify(token, 'PRIVATE_KEY');
                    res.send({status: 'success', paylad: decoded})

           // res.json({ mensaje: `Hola ${decoded.email}` });
        } catch (err) {
            res.status(403).json({ error: 'Token inválido' });
        }
    }
    
}

export default SessionsController