import UserDto from "../Dtos/users.dto.js"

class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    createUser = async newUser=> {
        const userDto = new UserDto(newUser)
        return await this.dao.create(userDto)
    }
    getUsers = async()=> await this.dao.get()
    getUser = async filter=> await this.dao.getBy(filter)
    updateUser = async(uid, userToUpdate)=> await this.dao.update(uid, userToUpdate)
    deleteUser = async uid=> await this.dao.delete(uid)

}

export default UserRepository