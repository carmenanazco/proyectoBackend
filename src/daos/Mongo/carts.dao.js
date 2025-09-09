import { cartModel } from "./models/cart.model.js"
import { userModel } from "./models/users.model.js";

class CartsDaoMongo{
    constructor(){
        this.model=cartModel
    }

    // get=async()=>await this.model.find().populate('products.product');
    // getBy=async filter=>await this.model.findOne(filter).populate('products.product');

    get=async filter=>await this.model.findOne(filter).populate('products.product');

    getBy=async filter=>await this.model.findOne(filter).populate('products.product');
    
    create=async newCart=> await this.model.create(newCart)
    update=async(cid, cartToUpdate)=> await this.model.findOneAndUpdate({_id:cid}, cartToUpdate, {new: true})
    deleteBy=async(cid, pid)=>await this.model.findByIdAndUpdate({_id:cid}, { $pull: { products: { product: pid } } }, {new: true})
    delete=async(cid)=> await this.model.findByIdAndDelete(cid)

}


export default CartsDaoMongo