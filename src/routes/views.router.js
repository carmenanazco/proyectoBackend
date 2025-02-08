import { Router } from "express";
import ProductManager  from '../fileManager/productManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async(req, res) =>{
    const products=await productManager.leerProductos()
    res.render('index', {
        products,
        style: "index.css"
    });

}) 

router.get('/realtimeproducts', async(req, res) =>{

    const products=await productManager.leerProductos()
    res.render('realtimeproducts', {
        products,
        style: "index.css"
    });
    
}) //renderizamos la vista realtimeproducts.handlebars



export default router;