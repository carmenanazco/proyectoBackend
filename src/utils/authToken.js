import jwt from 'jsonwebtoken'
import { configObject } from '../config/index.js'


const PRIVATE_KEY = configObject.privateKey
//genera el token
export const generateToken = userDataToken => jwt.sign(userDataToken, PRIVATE_KEY, {expiresIn: '1d'})


//midleware - autentication
export const authToken = (req, res, next) =>{
    const authHeader = req.headers['authorization']

    const token = authHeader.split('')[1]
    jwt.verify(token, PRIVATE_KEY, (error, userDecode)=>{
        if (error) return res.status(401).send({status: 'error', error: 'no authorized'})
        req.user = userDecode
        next()
    })
}


