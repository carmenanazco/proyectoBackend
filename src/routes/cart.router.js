import {Router} from 'express';
import {cartModel} from '../models/cart.model.js';
import {productModel} from '../models/product.model.js';
import { passportCall } from '../middlewares/passportCall.js';
import { userModel } from '../models/users.model.js';

const router = Router();

/*Mostrar todos los productos del carrito*/
router.get('/', passportCall('jwt'), async(req, res) => {
    try{
        let carts = await cartModel.findOne().populate('products.product');
        if(!carts || carts.products.length==0){
            return res.render('cartEmpty');
        }

        const total = carts.products.reduce((sum, item) => sum + item.subtotal, 0);
        console.log(total)
        res.render('carts', {carts: carts.products.map( cart => cart.toObject()), idCarts: carts._id, total});
    }catch(error){
        return res.render('error', {error:"Error al mostrar productos"});
    }
});

/*Mostrar un producto del carrito segun su id*/

router.get('/id', async(req, res) => {
    try{
        const carts = await cartModel.find()
        res.render('carts', {carts: carts.map( cart => cart.toObject())});
    }catch(error){
        return res.render('error', {error:"Error al mostrar productos"});
    }
});


/*Agregar productos al carrito segun id*/

router.post('/:id', async(req,res) =>{
    try{
        const productId = req.params.id;
        let carts = await cartModel.findOne()
        if(!carts){
            carts = new cartModel({products: []});
            userModel.carts.push({cart: cart._id})
        }
        const productInCart = carts.products.find(p=>p.product.equals(productId))
        const producto = await productModel.findById(productId);

        if(productInCart){
            productInCart.quantity+=1;
            productInCart.subtotal= producto.price*productInCart.quantity;

        }else{
            carts.products.push({product: productId, quantity:1, subtotal: producto.price})
        }

        await carts.save();
 
        res.redirect('/api/carts');
    }catch(error){
        return res.render('error', {error: "Error al insertar el producto al carrito"});
    }
})

/**Eliminar productos del carrito */
router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const productId = req.params.cid;
        let carts = await cartModel.findOne()
        if (carts) {
            carts.products = carts.products.filter(p => !p.product.equals(productId));
            await carts.save();
        }
        res.redirect('/api/carts');

    }catch(error){
        return res.render('error', {error: "Error al borrar un producto"});
    }
})

/**Eliminar todo el carrito */
router.delete('/:cid', async (req, res) => {
    try{
        const idCarrito = req.params.cid;
        await cartModel.findByIdAndDelete(idCarrito);
        res.redirect('/api/carts');

    }catch(error){
        return res.render('error', {error: "Error al borrar el carrito"});
    }
})

/**Modificar cantidades de productos en el carrito */
router.put('/:cid/products/:pid', async(req, res) =>{
    try{
        const {cid, pid} = req.params;        
        const cantidad= parseInt(req.body.cantidad);
        let carts = await cartModel.findOne()
        const productInCart = carts.products.find(p=>p.product.equals(pid))
        const producto = await productModel.findById(pid);

        if (cantidad) {
            productInCart.quantity=cantidad;
            productInCart.subtotal=producto.price*cantidad
            await carts.save()
        }
        res.redirect('/api/carts');
    }catch(error){
        return res.render('error', {error: "Error al actualizar el producto"});
    }
});

export default router