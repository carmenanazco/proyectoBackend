import passport from 'passport'
import jwt from 'passport-jwt'
import { configObject } from './index.js'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


const privateKey = configObject.privateKey


export const initializePassport = ()  =>{
    const cookieExtractor= (req) =>{
        let token = null
        if(req && req.cookies){
            token = req.cookies['coderCookieToken']
        }        
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    }, async(dataFromToken, done)=>{
        try {
            return done(null, dataFromToken)
        } catch (error) {
            done(error)
        }
    }))
    
}

