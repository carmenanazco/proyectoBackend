import {Router} from 'express';
import ProductManager  from '../fileManager/productManager.js';


const router = Router();
const productManager = new ProductManager();

/** Método GET: PARA OBTENER TODOS LOS RECURSOS
 * Retornar todos los productos
 */
router.get('/', async(req, res) => {
    res.send(await productManager.leerProductos())
})

/** Método GET: PARA OBTENER UN RECURSO
 * Retornar un producto según su ID .get(/:id)
 */
router.get('/:id', async(req, res) => {
    const productId = req.params.id;
    const productBuscado = await productManager.leerUnProducto(productId);
    res.json(productBuscado)
})


/** Método POST: PARA CREAR UN RECURSO
 * Crear un producto
 */

router.post('/', async(req,res) =>{
    const nuevoProducto = req.body;
    if(!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.code || !nuevoProducto.price || !nuevoProducto.stock || !nuevoProducto.category){
        return res.status(400).json({error: 'Incomplete values'});
    }
    res.send(await productManager.crearProducto(nuevoProducto))
});


/** Método PUT: PARA ACTUALIZAR UN RECURSO
 * Actualizar un producto
 */

router.put('/:id', async(req, res) =>{
    const productId = req.params.id;
    const productUpdated = req.body;
    res.send(await productManager.actualizarProducto(productId, productUpdated));
});


/** Método DELETE: PARA ELIMINAR UN RECURSO
 * Eliminar un producto
 */

router.delete('/:id', async(req, res) => {
    const productId = req.params.id;
    res.send(await productManager.eliminarProducto(productId))

    res.status(204).json({message: "Producto eliminado"});
})

export default router;