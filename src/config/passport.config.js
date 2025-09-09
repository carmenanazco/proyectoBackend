import passport from 'passport'
import jwt from 'passport-jwt'
import { configObject } from './index.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { userModel } from '../daos/Mongo/models/users.model.js'

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

    passport.use('google', new GoogleStrategy({
        clientID: configObject.googleClientID,
        clientSecret: configObject.gogleClientSecret,
        callbackURL: configObject.callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value
            let user = await userModel.findOne({ email })

            if (!user) {
                user = await userModel.create({
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email,
                    password: null, // No se usa contraseña
                    fromGoogle: true,
                    role: 'user',
                    googleId: profile.id
                })
            }
            
            return done(null, {
                id: user._id,
                first_name: user.first_name,
                email: user.email,
                role: user.role,
                carts: user.carts
            })
        } catch (error) {
            return done(error)
        }
    }))
}

