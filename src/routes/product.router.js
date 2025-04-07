import { Router } from 'express'; 
import { productModel } from '../daos/Mongo/models/product.model.js';
import { uploader } from '../utils/utilsMulter.js';
import { passportCall } from '../middlewares/passportCall.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import ProductController from '../controllers/products.controllers.js';

const router = Router();
const {
    createProduct, 
    getProducts, 
    getProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

router.get('/', getProducts);
router.get('/:pid', getProduct)
router.post('/', passportCall('jwt'), authorization('admin'), uploader.single('file') , createProduct);
router.put('/:pid', passportCall('jwt'), authorization('admin'), updateProduct);
router.delete('/:pid', passportCall('jwt'), authorization('admin'), deleteProduct)



router.get('/update/:id', async(req, res) => {
    try{
        const product = await productModel.findById(req.params.id);
        if(!product){
            return res.render('error', {error: "Producto no encontrado"});
        }
        res.render('updateProduct', {product: product.toObject()});
    }catch(error){
        console.log(req.query.q)
        return res.render('error', {error:"Error al obtener el producto solicitado"});
        }
})
export default router;