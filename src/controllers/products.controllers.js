import { productService } from "../services/index.js";

class ProductController{
    constructor(){
        this.service= productService
    }

    createProduct = async(req,res) =>{
        try{
            const {title, description, code, price, stock, category} = req.body;
            console.log(newproduct)
    
            thumbnail = `/img/${req.file.originalname}`;
    
            if(!title || !description || !code || !price || !stock || !category){
                return res.render('error', {error: "Campos incompletos"});
            }

            const newproduct = {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnail
            }

        const result = await this.service.createProduct(newproduct)
            res.render('product', {product: result.toObject()});
        }catch(error){
            return res.render('error', {error: "Error al insertar el producto"});
        }
    }

    getProducts = async(req, res) => {
        try{
            const products = await this.service.getProducts()
            res.render('products', {products: products.map( product => product.toObject())});
        }catch(error){
            return res.render('error', {error:"Error al mostrar productos"});
        }
    }

    getProduct=async(req, res) => {
        try{
            const product = await this.service.getProduct({_id: req.params.id});
            if(!product){
                return res.render('error', {error: "Producto no encontrado"});
            }
            res.render('product', {product: product.toObject()});
        }catch(error){
            console.log(req.query.q)
    
            return res.render('error', {error:"Error al obtener el producto solicitado"});
            }
    }

    updateProduct = async(req, res) =>{
        try{
            const product = req.body;
    
            /*if (!product.title || !product.category || !product.description || !product.code || !product.price || !product.stock) {
                return res.render('error', {error: "Campos incompletos"});
            }*/
    
            const updatedProduct = await this.service.updateProduct(req.params.pid, product);
            //await productUpdated.save();
            console.log(updatedProduct);
            if(!updatedProduct){
                return res.render('error', {error: "Producto no encontrado"});
            }

            res.redirect('/editProductos');
        }catch(error){
            return res.render('error', {error: "Error al actualizar el producto"});
        }
    }
    deleteProduct = async (req, res) => {
        try{
            const productDel = await this.service.deleteProduct(req.params.pid);
            if(!productDel){ 
                return res.render('error', {error: "No se encontró el producto a eliminar"})
            }
            res.redirect('/product');
            
        }catch(error){
            return res.render('error', {error: "Error al borrar un producto"});
        }
    }
}

export default ProductController