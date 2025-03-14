import passport from 'passport'
import jwt from 'passport-jwt'
import dotenv from "dotenv";
dotenv.config();

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const configkey = {
    privateKey: process.env.PRIVATE_KEY
}

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
        secretOrKey: configkey.privateKey
    }, async(dataFromToken, done)=>{
        try {
            return done(null, dataFromToken)
        } catch (error) {
            done(error)
        }
    }))
    
}

