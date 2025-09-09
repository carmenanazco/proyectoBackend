import { productService } from "../services/index.js";

class ProductController{
    constructor(){
        this.service= productService
    }

    createProduct = async(req,res) =>{
        try{

            const {title, description, code, price, stock, category} = req.body;
           // console.log(req.file)
            const thumbnail = `${req.protocol}://${req.get("host")}/img/${req.file.originalname}`;


        /*  app.post("/upload", upload.single("image"), async (req, res) => {
                try {
                const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
                
                const newImage = new ImageModel({ imageUrl }); // Guardar URL en MongoDB
                await newImage.save();
            
                res.json({ message: "Imagen subida correctamente", imageUrl });
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            });*/
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
            const {q, category, orden} = req.query;
            let filtros = {};
            let isFilter=false; //verifica si se selecciono filtros

            console.log(req.query);
            
            // Si no se seleciono una pagina  o cantidad de productos a mostrar, coloco uno por default
            let pageActual = parseInt(req.query.page) || 1;
            let limitActual = parseInt(req.query.limit) ||5;

             /**Verifico si se realizo una busqueda */
        if (q && q.trim() !==""){
           // filtros.description = {$regex: q, $options: "i"};
            filtros.title = {$regex: q, $options: "i"};            
            isFilter= true;
        }

        /**Compruebo si se selecciono una categoria */
        if (category) {
            isFilter= true;
            if (Array.isArray(category)) {
                filtros.category = { $in: category };
            } else {
                filtros.category = category;
            }
        }  

        /*Si se selecciono un orden de productos*/
        let ordenamiento = {};
        if (orden === "precio_asc") ordenamiento.price = 1;
        if (orden === "precio_desc") ordenamiento.price = -1;
        if (orden === "nombre_asc") ordenamiento.title = 1;
        if (orden === "nombre_desc") ordenamiento.title = -1;


        /*Establezco las opciones selecionadas*/
        const opciones = {
            page: pageActual,
            limit: limitActual,
            sort: ordenamiento
        };

        let infoPaginate = await this.service.getProducts(filtros, opciones)
        //console.log(infoPaginate);
        
        let product = infoPaginate.docs.map( doc => doc.toObject());
        
       /* if(product.length==0){
            return res.status(404).json({message: 'no hay productos'})
        }*/
        
        
        //res.render('products', {products: product, query: q, isFilter, category, orden, info: infoPaginate, limit:limitActual});
        res.status(200).json({status: 'success', payload: product, info: infoPaginate, limit:limitActual});
            //res.render('products', {products: products.map( product => product.toObject())});
        }catch(error){
            return res.status(500).json({ error: "Error al mostrar el carrito" });
        }
    }

    getProduct=async(req, res) => {
        try{
            const product = await this.service.getProduct({_id: req.params.pid});
            if(!product){
                return res.status(404).json({message: 'Producto no encontrado'})
            }
            res.status(200).json({status:'success', product})
            res.render('product', {product: product.toObject()});
        }catch(error){
            console.log(req.query.q)
                return res.status(500).json({ error: "Error al obtener el producto solicitado" });

            //return res.render('error', {error:"Error al obtener el producto solicitado"});
            }
    }

    updateProduct = async(req, res) =>{
        try{
            const product = req.body;
    
            /*if (!product.title || !product.category || !product.description || !product.code || !product.price || !product.stock) {
                return res.render('error', {error: "Campos incompletos"});
            }*/    
            const updatedProduct = await this.service.updateProduct(req.params.pid, product);
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