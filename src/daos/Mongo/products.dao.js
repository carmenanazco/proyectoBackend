import { productModel } from "./models/product.model.js"

class ProductDaoMongo{
    constructor(){
        this.model= productModel
    }
    // get = async() => await productModel.find();
    get = async(filtros, opciones) => await this.model.paginate(filtros, opciones)
    create = async newProduct => await productModel.create(newProduct);
    getBy = async filterObject => await productModel.findOne(filterObject)
    update = async (pid, productToUpdate) => productModel.findOneAndUpdate({_id:pid}, productToUpdate, {new: true})
    delete = async pid => await productModel.findByIdAndDelete({_id: pid})
}

export default ProductDaoMongo