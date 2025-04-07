import { Router } from "express";
import { passportCall } from '../middlewares/passportCall.js'
import { authorization } from '../middlewares/authorization.middleware.js'
import {productModel} from '../daos/Mongo/models/product.model.js';
import ViewsController from "../controllers/views.controllers.js";

const router = Router();
const {home, login, register} = new ViewsController()

router.get('/', home)
router.get('/login', login)
router.get('/register', register)

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



export default router;