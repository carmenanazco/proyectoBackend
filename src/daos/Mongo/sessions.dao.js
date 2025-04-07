//modelo o persistencia
import { userModel } from "./models/users.model.js";

class SessionsDaoMongo{
    constructor(){
        this.userModel=userModel
    }

    getUser = async email =>await this.userModel.findOne({email})
    createUser = async newUser =>await this.userModel.create(newUser)

}

export default SessionsDaoMongo