//modelo o persistencia
import { userModel } from "./models/users.model.js";

class UsersDaoMongo{
    constructor(){
        this.userModel=userModel
    }

    get = async() =>await this.userModel.find()
    create = async newUser =>await this.userModel.create(newUser)
    getBy= async(filter)=> await this.userModel.findOne(filter)
    update= async(uid, usersToUpdate)=> this.userModel.findByIdAndUpdate({_id:uid}, usersToUpdate, {new: true})
    delete = async uid => await this.userModel.findByIdAndDelete({_id: uid})
}

export default UsersDaoMongo