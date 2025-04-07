
class UsersDaoFS{
    constructor(){
        this.users=''
    }

    get = () => this.users
    create =  newUser => this.users.push(newUser)

}

export default UsersDaoFS