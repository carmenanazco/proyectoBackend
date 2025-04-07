import { configObject } from '../config/index.js'
import UsersDaoMemory from './Memory/usersMemory.dao.js'
import CartsDaoMongo from './Mongo/carts.dao.js'
import ProductDaoMongo from './Mongo/products.dao.js'
import UsersDaoMongo from './Mongo/users.dao.js'

const { persistence } = configObject
export let UsersDao
export let ProductsDao
export let CartsDao

switch (persistence) {
    case 'MEMORY':
        //const UsersDaoMemory = require('./Memory/usersMemory.dao.js')
        UsersDao = UsersDaoMemory        
        break;

    /*case 'FS':
        const UsersDaoFS = require('./FS/usersFS.dao.js') 
        UsersDao = UsersDaoFS
        
    break;*/

    default:
       // const UsersDaoMongo = require('./Mongo/users.dao.js') 
        UsersDao = UsersDaoMongo
        ProductsDao = ProductDaoMongo
        CartsDao= CartsDaoMongo
        break;
}
