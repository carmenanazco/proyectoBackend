import {Router} from 'express';
import productModel from '../models/product.model.js';

const router = Router();

router.get('/', async(req, res)=>{
    try{
        const {q, category, orden, page, limit} = req.query;
        let filtros = {};

        if (q && q.trim() !==""){
            filtros.title = {$regex: q, $options: "i"};
        }else{
            q ="";
        }
        if (category) {
            if (Array.isArray(category)) {
                filtros.category = { $in: category };
            } else {
                filtros.category = category;
            }
        } else{
            category = ""
        }    

        let ordenamiento = {};
        if (orden === "precio_asc") ordenamiento.price = 1;
        if (orden === "precio_desc") ordenamiento.price = -1;
        if (orden === "nombre_asc") ordenamiento.title = 1;
        if (orden === "nombre_desc") ordenamiento.title = -1;
    

        page = parseInt(page) || 1; 
        limit = parseInt(limit) || 10; 
        const opciones = {
            page,
            limit,
            sort: ordenamiento
        };



        let infoPaginate = await productModel.paginate(filtros, opciones);
        let product = infoPaginate.docs.map( doc => doc.toObject());

        console.log(product)
        

        if(product.length==0){
            return res.render('productsEmpty');
        }


        //console.log(product)
        res.render('products', {products: product, query: q, category, orden, page: infoPaginate.page, totalPages: infoPaginate.totalPages});
    }catch(error){
        return res.render('error', {error: "Error al buscar el producto"})
    }
})



export default router;