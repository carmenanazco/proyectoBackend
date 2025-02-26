import { Router } from "express";

const router = Router();

router.get('/', (req,res) => {
    res.render('index');
})

router.get('/crearProducto', (req,res) => {
    res.render('newProduct');
})


router.get('/realtimeproducts', async(req, res) =>{

    res.render('realtimeproducts', {
    });
    
}) //renderizamos la vista realtimeproducts.handlebars


export default router;