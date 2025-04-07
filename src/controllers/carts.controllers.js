import { CartService, productService, usersService } from "../services/index.js";

class CartController{
    constructor(){
        this.service=CartService
        this.serviceUser=usersService
        this.serviceProd=productService
    }

    createCart=async(req,res) =>{
        try{
            const productId = req.params.cid;
            let userLog = await this.serviceUser.getUser({_id: req.user.id})
            let product = await this.serviceProd.getProduct({_id: productId})
            let carts = await this.service.getCarts({_id: userLog.carts})

            if(!userLog.carts){
                carts= await this.service.createCart({products: []})
                userLog.carts=carts._id
                carts.products.push({product: productId, quantity:1, subtotal: product.price})
                await userLog.save()

            }else{
                const productInCart = carts.products.find(p=>p.product.equals(productId))

                if(!productInCart){
                    carts.products.push({product: productId, quantity:1, subtotal: product.price})
                    //console.log(carts.products);

                }else{
                    productInCart.quantity+=1;
                    productInCart.subtotal= product.price*productInCart.quantity;
                }

            }
           // console.log(carts);
            
            await carts.save();
            res.redirect('/api/carts');
        }catch(error){
            return res.render('error', {error: "Error al insertar el producto al carrito"});
        }
    }



  /*  createCart=async(req,res) =>{
        try{
            const productId = req.params.id;
            //const user = req.user

            //let userLog = await userModel.findById(user.id)
            //let carts = await userModel.find().populate('carts.cart');
            let userLog = await this.serviceUser.getUser({_id: req.user.id})

            let carts = userLog.carts
            if(carts==0){
                carts= await this.service.createCart({products: []})
                //carts = new cartModel({products: []});
                userLog.carts.push({cart: carts._id})
                await userLog.save()
            }
            console.log(carts);


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
    }*/
    getCarts=async(req, res) => {
        try{
            //console.log(req.user);
            let userLog = await this.serviceUser.getUser({_id: req.user.id})
            let carts = await this.service.getCarts({_id: userLog.carts})
            if(!carts || carts.products.length==0){
                return res.render('cartEmpty');
            }
    
            const total = carts.products.reduce((sum, item) => sum + item.subtotal, 0);
           // console.log(total)
            res.render('carts', {carts: carts.products.map( cart => cart.toObject()), idCarts: carts._id, total});
        }catch(error){
            return res.render('error', {error:"Error al mostrar el carrito"});
        }
    }

    getCart=async(req, res) => {
        try{
            const carts = await this.service.getCart()
            res.render('carts', {carts: carts.map( cart => cart.toObject())});
        }catch(error){
            return res.render('error', {error:"Error al mostrar productos"});
        }
    }

    updateCart=async(req, res) =>{
        try{
            const {cid, pid} = req.params; 
            const cantidad= parseInt(req.body.cantidad);       
            let userLog = await this.serviceUser.getUser({_id: req.user.id})
            let product = await this.serviceProd.getProduct({_id: pid})
            let carts = await this.service.getCarts({_id: userLog.carts})
            const productInCart = carts.products.find(p=>p.product.equals(pid))

            if (cantidad) {
                productInCart.quantity=cantidad;
                productInCart.subtotal=product.price*cantidad
                //console.log(productInCart);
                //console.log(carts);

                await carts.save();
                //const updatedCart = await this.service.updateCart(pid, productInCart);
            }
            res.redirect('/api/carts');
        }catch(error){
            return res.render('error', {error: "Error al actualizar el producto"});
        }
    }

    /**Eliminar un producto del carrito */
    
    deleteCart=async (req, res) => {
        try{
            const productId = req.params.pid;
            let userLog = await this.serviceUser.getUser({_id: req.user.id})
            let carts = await this.service.getCarts({_id: userLog.carts})
            if (carts) {
                console.log(carts);

                const updatedCart = await this.service.deleteCart(userLog.carts, productId);

               // carts.products = carts.products.filter(p => !p.product.equals(productId));
               // await carts.save();
            }
            res.redirect('/api/carts');
    
        }catch(error){
            return res.render('error', {error: "Error al borrar un producto"});
        }
    }

/**Eliminar todo el carrito */
    deleteCarts=async (req, res) => {
        try{
            const idCarrito = req.params.cid;
            let userLog = await this.serviceUser.getUser({_id: req.user.id})
            await this.service.deleteCarts(idCarrito, req.user.id)
            console.log('Carrito eliminado');

            res.redirect('/api/carts');
    
        }catch(error){
            return res.render('error', {error: "Error al borrar el carrito"});
        }
    }

}

export default CartController