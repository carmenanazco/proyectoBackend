import { Router } from 'express';
import { userModel } from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/authToken.js";
import { passportCall } from '../middlewares/passportCall.js'
import { authorization } from '../middlewares/authorization.middleware.js'

const router = Router()

//register jwt
router.post('/register', async(req, res)=>{
    const { first_name, last_name, email, password } = req.body;

    if (!email || !password) return res.status(400).render('error', {error: 'email y password son obligatorios'})

    const userFound = await userModel.findOne({email})
    if(userFound) return res.status(401).render('error', { error: 'el email ya existe'})

    const newUser = {
        first_name,
        last_name,
        email,
        password: createHash(password)
    }

    const result = await userModel.create(newUser)
    res.render('login')
    //res.send({status: 'success', paylad: result})

})

//login
router.post('/login', async(req, res)=>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).render('error', {error: 'email y password son obligatorios'})

    const userFound = await userModel.findOne({email})
    if(!userFound) return res.status(401).render('error', {error: 'el usuario no existe'})

    if(!isValidPassword(password, { password: userFound.password })) return res.status(401).render('error', {error: 'el email o la contraseña mno coinciden'})

    const token = generateToken({
        id: userFound._id,
        email: userFound.email,
        role: userFound.role,
        isAdmin: userFound.role == 'admin'
    })

const isAdmin=userFound.role == 'admin'
    res
    .cookie('coderCookieToken', token, {
        maxAge: 60*60*1000,
        httpOnly: true

    })
    .render('index', {usuario: userFound.toObject(), isAdmin})
    //.send({status: 'success', message: 'Logged success'})
})


//logout
router.get('/logout', (req, res)=>{
    try {
        res.clearCookie('coderCookieToken').render('index')       
    } catch (error) {
        return res.render('error', {error:"Error al salir"});
    }
})

//current
router.get('/current', passportCall('jwt'), authorization('admin'), (req, res)=>{
        
    res.send({status: 'success', paylad: req.user})
})

export default router;