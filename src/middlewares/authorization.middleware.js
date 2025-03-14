export const authorization = role =>{
    return async(req, res, next)=>{
        if(!req.user) return res.status(401).send({error: 'Unathorizaed'})
        if(req.user.role !== role) return res.status(401).send({error: 'No tiene permiso'})
        if(req.user.role== 'admin'){
            res.locals.isAdmin = true
            console.log(res.locals);
            
        }


        next()
    }
}

