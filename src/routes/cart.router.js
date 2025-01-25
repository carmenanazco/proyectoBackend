import {Router} from 'express';
import productManager from '../fileManager/productManager.js';
import CartManager from '../fileManager/cartManager.js';


const router = Router();
const cartManager = new CartManager();

router.post("/", (req, resp) => {
    const productId = req.params.id;
    const productBuscado = productManager.leerUnProducto(productId);

    const primerProductCart ={
        id: productId,
        title: productBuscado.title,
        quantity: 1
    }

    cartManager.crearCarrito(primerProductCart);
    const productsEnCarrito = cartManager.mostrarCart();
    res.json({productsEnCarrito})
    
})


router.get("/:cid", (req, resp) => {
    const productInCartId = req.params.cid;
    const productInCart = productManager.mostrarUnProductoCart(productInCartId);
    res.json(productInCart)
    
})


router.post("/:cid/product/:pid", (req, resp) => {
    const idC = req.params.cid;
    
    const productId = req.params.id;
    const productBuscado = productManager.leerUnProducto(productId);

    const productCart ={
        id: productId,
        title: productBuscado.title,
        quantity: 1
    }

    cartManager.agregarProduct(idC,productCart);
    const productsEnCarrito = cartManager.mostrarCart();
    res.json({productsEnCarrito})
})



export default router