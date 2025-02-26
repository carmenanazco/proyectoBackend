import mongoose from "mongoose";

const cartCollection = 'carts';

const cartSchema = mongoose.Schema({
    products:[
        { 
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
            quantity: {type: Number, default:1},
            subtotal: {type: Number, default:0}
        }
    ]
});

cartSchema.pre('find', function(next){
    this.populate('products.product');
    next();
})

const cartModel = mongoose.model(cartCollection, cartSchema);


export default cartModel