import {Router} from 'express';
import {productModel} from '../daos/Mongo/models/product.model.js';

const router = Router();

/**Ruta para buscar, filtrar y aplicar paginacion */
router.get('/', async(req, res)=>{
    try{
        const {q, category, orden} = req.query;
        let filtros = {};
        let isFilter=false; //verifica si se selecciono filtros

        // Si no se seleciono una pagina  o cantidad de productos a mostrar, coloco uno por default
        let pageActual = parseInt(req.query.page) || 1;
        let limitActual = parseInt(req.query.limit) ||5;
        

        /**Verifico si se realizo una busqueda */
        if (q && q.trim() !==""){
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

        let infoPaginate = await productModel.paginate(filtros, opciones);
        let product = infoPaginate.docs.map( doc => doc.toObject());

        if(product.length==0){
            return res.render('productsEmpty');
        }

        //console.log(infoPaginate)

        res.render('products', {products: product, query: q, isFilter, category, orden, info: infoPaginate, limit:limitActual});
    }catch(error){
        return res.render('error', {error: "Error al buscar el producto"})
    }
})

export default router;