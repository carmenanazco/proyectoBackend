import {usersService} from "../services/index.js"

class UserController{
    constructor(){
        this.service = usersService
    }

    createUser= async(req, res)=>{
        try {
            const user = await this.usersService.createUser(req.body)
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({error: "Error al crear el usuario"})
        }
    }

    getUsers= async(req, res)=>{
        try {
            const users = await this.service.getUsers()
            res.send({status: 'success', paylad: users})
        } catch (error) {
            res.status(500).json({error: "Error al obtener usuarios"})
        }
    }

    getUser=async(req, res)=>{
        try {
            const user = await this.service.getUser({_id: req.user.uid})
            if(!user) return res.status(404).json({error: "Error al encontrar el usuario"})
            res.json(user)
        } catch (error) {
            res.status(500).json({error: "Error al obtener perfil"})
        }
        
    }

    updateUser=async(req, res)=>{
        try{
            const updatedUser = await this.service.updateUser(req.user.uid, req.body);
            if(!updatedUser){
                return res.render('error', {error: "User no encontrado"});
            }
            res.json(updatedUser)
            //res.redirect('/index');
        }catch(error){
            //return res.render('error', {error: "Error al actualizar el usuario"});
            res.status(500).json({error: "Error al editar perfil"})
        }
    }

    deleteUser=async(req, res)=>{
        try {
            await this.service.deleteUser(req.user.uid)
            res.send('delete user')

        } catch (error) {
            res.status(500).json({error: "Error al eliminar usuario"})
        }
    }
}

export default UserController