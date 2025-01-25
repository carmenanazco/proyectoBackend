import fs from 'fs';

class CartManager {


    constructor(){
        this.filePath = './cart.json';
    }
    
    async crearCart(product) {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            if(!data){
                const cart = [];

                let nuevo = {};
                nuevo.id = 1;
                nuevo.product = product;
                cart.push(nuevo);
                await fs.writeFile(this.filePath, JSON.stringify(cart,null,2));
            }else{
                return data
            }
    
        }catch (error) {
            console.error('Error al crear nuevo carrito', error)
            throw error;
        }
    }
    



    async mostrarCart() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data) || [];
        }catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error('Error al leer el carrito:', error);
                throw error; 
            }
        }
    }


    async mostrarUnProductoCart(cid){
        try{
            let products = await this.mostrarCart();
            const product = products.find(product => product.id === cid)
            return product;

        }catch(error){
            if (!product) {
                return console.error('Producto no encontrado:', error);
        }
    }
    }

    async agregarProduct(idC,product) {
        try {
            let cart = await this.mostrarCart();
            const cartIndex = cart[idC].product.findIndex(product => product.id ===id);

            if (cartIndex === -1){
                let nuevo = {};
                nuevo.id= (cart.length + 1).toString(),
                nuevo.product = product;
                cart.push(nuevo);

            }else {
                cart[idC].product.quantity += 1;
            }            
            await fs.writeFile(this.filePath, JSON.stringify(carts,null,2));
        }catch (error) {
            console.error('Error al agregar el producto', error);
            throw error;
        }       
    }

}

export default CartManager;