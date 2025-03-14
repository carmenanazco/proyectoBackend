import { Schema, model} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";

const productSchema= new Schema({
    title: {
        type: String, 
        require: true, 
        minlength: 3,
        index: true
    },
    category: {
        type: String, 
        require: true, 
        enum: ["figuras", "resinados", "lamparas"]
    },
    description: {type: String, require: true},
    price: {type: Number, require: true, index: true},
    code: {type: String, require: true},
    stock: {type: Number, require: true},
    thumbnail: {type: String}
});

productSchema.plugin(mongoosePaginate)
export const productModel = model(productCollection, productSchema);
