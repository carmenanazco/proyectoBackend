import { Router } from "express";
import { passportCall } from '../middlewares/passportCall.js'
import { authorization } from '../middlewares/authorization.middleware.js'
import {productModel} from '../models/product.model.js';

const router = Router();

router.get('/', (req,res) => {
    res.render('index');
})

router.get('/crearProducto', passportCall('jwt'), authorization('admin'),(req,res) => {
    res.render('newProduct');
})

router.get('/editProductos', passportCall('jwt'), authorization('admin'), async(req,res) => {
    const products = await productModel.find();

    res.render('editarProducts', {products: products.map( product => product.toObject())});
})

// router.get('/', (req, res)=>{
//     res.render('home', {})
// })

router.get('/login', (req, res)=>{
    res.render('login', {})
})

router.get('/register', (req, res)=>{
    res.render('register', {})
})

export default router;