import {Router} from 'express';
import productModel from '../models/product.model.js';

const router = Router();

router.get('/', async(req, res)=>{
    try{
        const {q, category, orden} = req.query;
        let pageActual = parseInt(req.query.page) || 1;
        let limitActual = parseInt(req.query.limit) ||1;
        let filtros = {};
        let isFilter=false;

        if (q && q.trim() !==""){
            filtros.title = {$regex: q, $options: "i"};
            isFilter= true;
        }

        if (category) {
            isFilter= true;
            if (Array.isArray(category)) {
                filtros.category = { $in: category };
            } else {
                filtros.category = category;
            }
        }  

        let ordenamiento = {};
        if (orden === "precio_asc") ordenamiento.price = 1;
        if (orden === "precio_desc") ordenamiento.price = -1;
        if (orden === "nombre_asc") ordenamiento.title = 1;
        if (orden === "nombre_desc") ordenamiento.title = -1;


        // page = parseInt(page) || 1; 
        // limit = parseInt(limit) || 10; 


        const opciones = {
            page: pageActual,
            limit: limitActual,
            sort: ordenamiento
        };


        let infoPaginate = await productModel.paginate(filtros, opciones);
        let product = infoPaginate.docs.map( doc => doc.toObject());
       //console.log(filtros)


        if(product.length==0){
            return res.render('productsEmpty');
        }

        console.log(infoPaginate)

        res.render('products', {products: product, query: q, isFilter, category, orden, info: infoPaginate, limit:limitActual});
    }catch(error){
        return res.render('error', {error: "Error al buscar el producto"})
    }
})



export default router;