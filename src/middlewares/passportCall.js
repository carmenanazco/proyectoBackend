import passport from 'passport'

export const passportCall = () =>{
    return async(req, res, next)=>{
        passport.authenticate('jwt', function(err, user, info){
            if(err) return next(err)

            if(user){
                req.user=user
                return next()
            }
            passport.authenticate('google-session', function (err2, user2, info2) {
                if (err2) return next(err2)
                if (!user2) {
                    return res.status(401).send({
                    error: info2?.message || 'No autorizado'
                })
            }

            req.user = user2
            
                
            next()
            //if(!user) return res.status(401).send({error: info.messages ? info.messages : info.toString() })
            })(req, res, next)
        })(req, res, next)
    }
}



