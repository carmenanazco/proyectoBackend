import mongoose, {mongo} from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";

const productSchema= mongoose.Schema({
    title: {type: String, 
            require: true, 
            minlength: 3,
            index: true
        },
    category:   {type: String, 
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
const productModel = mongoose.model(productCollection, productSchema);


export default productModel