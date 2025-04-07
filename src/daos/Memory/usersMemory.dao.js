
class UsersDaoMemory{
    constructor(){
        this.users=[]
    }

    get = () => this.users
    create =  newUser => this.users.push(newUser)

}

export default UsersDaoMemory