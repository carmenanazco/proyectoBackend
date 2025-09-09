import { ticketModel } from "../daos/Mongo/models/ticket.model.js";
import transporter from "../services/emailService.js";
import { cartService, productService, usersService } from "../services/index.js";
import { generarReciboPDF } from "../utils/generarReciboPDF.js";

class CartController{
    constructor(){
        this.service=cartService
        this.serviceUser=usersService
        this.serviceProd=productService
    }

    createCart = async (req, res) => {
        try {
           // console.log("REQ.BODY:", req.body);

            const {productId, quantity} = req.body
            if (!req.user) {
                return res.status(401).json({ error: "No autorizado" });
            }
            const userLog = await this.serviceUser.getUser({_id: req.user.id});
            const product = await this.serviceProd.getProduct({_id: productId});

            if (!product) {
                return res.status(401).json({ error: "Producto no encontrado" });
            }
            if (product.stock < 1) {
                return res.status(401).json({ error: "Stock insuficiente" });
            }

            let cart = await this.service.getCarts({_id: userLog.carts});
            if (!cart) {
                cart = await this.service.createCart({ products: [] });
                userLog.carts = cart._id;
                await userLog.save();
            }
            const productInCart = cart.products.find(p => p.product.equals(productId));

            if (!productInCart) {
                cart.products.push({ product: productId, quantity, subtotal: product.price });
            } else {
                if (productInCart.quantity < product.stock) {
                    productInCart.quantity += 1;
                    productInCart.subtotal = product.price * productInCart.quantity;
                } else {
                    console.log(product);

                    return res.json({ message: "No puedes agregar más unidades de este producto.", cart  });
                    //return res.render("error", { error: "No puedes agregar más unidades de este producto." });
                }
            }
            const updatedCart= await cart.save();
            res.json({message: "Producto agregado al carrito", cart:updatedCart});

//res.redirect("/api/carts");
        } catch (error) {
            return res.status(400).json({ error: "Error al insertar el producto al carrito" });

            // return res.render("error", { error: "Error al insertar el producto al carrito" });
        }
    };

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
            //console.log("cart",req.user)

            let userLog = await this.serviceUser.getUser({_id: req.user.id})

            let cart = await this.service.getCarts({_id: userLog.carts})

            if(!userLog) return res.status(401).json({ error: "Usuario no registrado"});
            if(!cart || cart.products.length===0){
                return res.status(200).json({ cart: { products: [], total: 0 }, empty: true, user:userLog });

                //return res.render('cartEmpty');
            }
    
            let total = 0;
            cart.products.forEach(item => {
                total += item.product.price * item.quantity;
                item.subtotal = item.product.price * item.quantity; // Precio actualizado
            });

            total+=cart.shipping
            await cart.save();
            const cartData = {
                _id: cart._id,
                shipping: cart.shipping,
                codigoPostal: cart.codigoPostal,
                products: cart.products.map(p => ({
                    product: {
                    _id: p.product._id,
                    title: p.product.title,
                    price: p.product.price,
                    category: p.product.category,
                    stock: p.product.stock
                    },
                    quantity: p.quantity,
                    subtotal: p.subtotal
                })),
                total
            };

            return res.status(200).json({ cart: cartData, total, user: userLog });
            //const total = carts.products.reduce((sum, item) => sum + item.subtotal, 0);
             // res.json({ cart: req.user.cart }); // o los datos que quieras mandar

          //  res.render('carts', {carts: cart.products.map( cart => cart.toObject()), idCarts: cart._id, total});
        }catch(error){
            console.error("Error al mostrar el carrito:", error);
            return res.status(500).json({ error: "Error al mostrar el carrito" });
            //return res.render('error', {error:"Error al mostrar el carrito"});
        }
    }

    getCart=async(req, res) => {
        try{
            const carts = await this.service.getCart()
            res.render('carts', {carts: carts.products.map( cart => cart.toObject())});
        }catch(error){
            return res.render('error', {error:"Error al mostrar productos"});
        }
    }
/*
    getCarts = async (req, res) => {
        try {
            const userLog = await this.serviceUser.getUser({_id: req.user.id});
            const cart = await this.service.getCarts({_id: userLog.carts});

            if (!cart || cart.products.length === 0) {
                return res.render("cartEmpty");
            }

            const total = cart.products.reduce((sum, item) => sum + item.subtotal, 0);
            res.render("carts", { carts: cart.products.map(cart => cart.toObject()), idCarts: cart._id, total });
        } catch (error) {
            return res.render("error", { error: "Error al mostrar el carrito" });
        }
    };*/


 /** Actualizar cantidad de un producto en el carrito */
    updateCart = async (req, res) => {
        try {
            const {productId, quantity} = req.body
            const cantidad = parseInt(quantity);
            const userLog = await this.serviceUser.getUser({ _id: req.user.id });
            const product = await this.serviceProd.getProduct({ _id: productId });
            const cart = await this.service.getCarts({ _id: userLog.carts });

            if (!cart || !product) {
                return res.status(404).json({ error: "Carrito o producto no encontrado" });
                //return res.render("error", { error: "Carrito o producto no encontrado" });
            }

            const productInCart = cart.products.find(p => p.product.equals(productId));     
            if (productInCart) {
                if (cantidad <= product.stock) {
                    productInCart.quantity = cantidad;
                    productInCart.subtotal = product.price * cantidad;
                    await cart.save();
                } else {
                    return res.status(400).json({ error: "La cantidad supera el stock disponible." });
                }
            }
            res.json({ message: "Cantidad actualizada", cart });

            //res.redirect("/api/carts");
        } catch (error) {
            return res.status(400).json({ error: "Error al actualizar el producto" });

           // return res.render("error", { error: "Error al actualizar el producto" });
        }
    };





/*
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
    }*/


    /**Eliminar un producto del carrito */
    deleteCart = async (req, res) => {
        try {
            const productId = req.params.pid;
            const userLog = await this.serviceUser.getUser({ _id: req.user.id });
            const cart = await this.service.getCarts({ _id: userLog.carts });
                                    console.log(cart);

            if (!cart) return res.status(404).json({error: "No se encontro el carrito"})
            cart.products = cart.products.filter(p => !p.product.equals(productId));
            await cart.save();
        console.log(cart);

            res.json({message: 'Producto eliminado del carrito', cart})

            //res.redirect("/api/carts");
        } catch (error) {
            
            res.status(500).json({ error: "Error al eliminar el producto"})
           // return res.render("error", { error: "Error al borrar un producto" });
        }
    };

/**Eliminar todo el carrito */
    deleteCarts = async (req, res) => {
        try {
            const userLog = await this.serviceUser.getUser({ _id: req.user.id });
            const cart = await this.service.getCarts({ _id: userLog.carts });
            if (!cart) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            
            cart.products= []
                        console.log(cart);

            await cart.save()
            res.json({message: "Carrito vaciado con exito"})
        } catch (error) {
            return res.status(500).json({ error: "Error al vaciar el carrito" });
        }
    };


// ✅ POST /api/carts/checkout

    finalizarCompra = async (req, res) => {
    try {
        const user = await this.serviceUser.getUser({ _id: req.user.id });
        const cart = await this.service.getCarts({ _id: user.carts });

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío." });
        }
        
        let total = 0;
        const productosOrden=[];

        for (const item of cart.products) {
            const producto = await this.serviceProd.getProduct({ _id: item.product });

            if (!producto) {
                return res.status(404).json({ error: `Producto no encontrado` });
            }

            if (producto.stock < item.quantity) {
                return res.status(400).json({ error: `Stock insuficiente para ${producto.title}` });
            }

            // Resta stock
            producto.stock -= item.quantity;
            await producto.save();

            const subtotal = producto.price * item.quantity;
            total+=subtotal;
                                console.log(total);

        productosOrden.push({
            productId: producto._id,
            quantity: item.quantity,
            subtotal
        });
    }
        const nuevaOrden= await ticketModel.create({
            user: user._id,
            products: productosOrden,
            total
        });


        // Vacía el carrito
        cart.products = [];
        await cart.save();


const htmlEmail = `
  <h2>Gracias por tu compra, ${user.first_name || 'cliente'}!</h2>
  <p>Este es tu resumen de compra:</p>
  <ul>
    ${productosOrden.map(p => `
      <li>${p.quantity} x ${p.productId.title} - $${p.subtotal.toFixed(2)}</li>
    `).join('')}
  </ul>
  <h3>Total: $${total.toFixed(2)}</h3>
  <p>Fecha: ${new Date().toLocaleString()}</p>
`;

const bufferPDF=await generarReciboPDF({user,
    productos: productosOrden,
    total
})
await transporter.sendMail({
  from: 'Ecommerce <no-responder@ecommerce.com>',
  to: user.email,
  subject: '🧾 Confirmación de compra',
  html: htmlEmail,
  attachments: [{
    filename: `recibo_${Date.now()}.pdf`,
    content: bufferPDF,
    contentType: 'application/pdf'
  }]
});

        res.status(200).json({ message: "Compra realizada con éxito", orderId: nuevaOrden._id });



    } catch (error) {
        console.error("Error en checkout:", error);
        res.status(500).json({ error: "Ocurrió un error al finalizar la compra" });
    }
    };
}





export default CartController