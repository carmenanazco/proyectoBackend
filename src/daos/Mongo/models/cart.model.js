import { Schema, model} from "mongoose";

const cartCollection = 'carts';

const cartSchema = new Schema({
    products:[
        { 
            product: {type: Schema.Types.ObjectId, ref: 'products'},
            quantity: {type: Number, default:1},
            subtotal: {type: Number, default:0}
        }
    ]
});

cartSchema.pre('find', function(next){
    this.populate('products.product');
    next();
})

export const cartModel = model(cartCollection, cartSchema);
