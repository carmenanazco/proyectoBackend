import {Router} from 'express';
//import {v4 as uuidv4} from 'uuid'
import ProductManager  from '../fileManager/productManager.js';


const router = Router();
const productManager = new ProductManager();

/** Método GET: PARA OBTENER TODOS LOS RECURSOS
 * Retornar todos los productos
 */
router.get('/', (req, res) => {
    const products = productManager.leerProductos();
    res.json({products})
})


/** Método GET: PARA OBTENER UN RECURSO
 * Retornar un producto según su ID .get(/:id)
 */
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    const productBuscado = productManager.leerUnProducto(productId);
    res.json(productBuscado)
})


/** Método POST: PARA CREAR UN RECURSO
 * Crear un producto
 */


router.post('/api/product', (req,res) =>{
    const {title, description, code, price, stock, category, thumbnails} = req.body;

    if(!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category){
        return res.status(400).json({error: 'Incomplete values'});
    }
    
    const newProduct = {
        id: (productManager.length + 1).toString(),
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    };

    productManager.crearProducto(newProduct);
});


/** Método PUT: PARA ACTUALIZAR UN RECURSO
 * Actualizar un producto
 */



router.put('/api/product/:id', (req, res) =>{

    const productId = req.params.id;
    const {title, description, code, price, stock, category, thumbnails} = req.body;

    const productUpdated = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails};

    productManager.actualizarProducto(productId, productUpdated )
});

/** Método DELETE: PARA ELIMINAR UN RECURSO
 * Eliminar un producto
 */

router.delete('/api/product:id', (req, res) => {
    const productId = req.params.id;
    productManager.eliminarProducto(productId)

    res.status(204).json({message: "Producto eliminado"});
})

export default router;