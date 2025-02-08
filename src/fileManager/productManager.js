import {promises as fs} from 'fs';

class ProductManager {
 
    constructor(){
        this.filePath = './productos.json';
    }

    async leerArchivo(){
        try{
            const data = await fs.readFile(this.filePath, 'utf-8');
            //console.log(data)
            const productos = JSON.parse(data)
           // console.log(productos)
            return productos;
        }catch(error){
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error('Error al leer productos:', error);
                throw error; 
            }
        }
    }

    leerProductos = async ()=>{
        return await this.leerArchivo()
    }

    async leerUnProducto(id){
        try{
            let products = await this.leerArchivo();
            const product = products.find(product => product.id === id)
            return product;

        }catch(error){
            if (!product) {
                return console.error('Producto no encontrado:', error);
            }
        }
    }
    
    async escribirArchivo(product){
        await fs.writeFile(this.filePath, JSON.stringify(product));
    }

    //Almacenar producto en el archivo
    crearProducto = async(product)=>{
        try{         
        //Leer el archivo y obtenemos un objeto con los productos
            const productos= await this.leerArchivo();
            product.id = (productos.length + 1).toString()
            const todosLosProductos = [...productos, product]
        //Escribir el archivo
            await this.escribirArchivo(todosLosProductos)
            return "Producto agregado"
        }catch(error){
            console.error('Error al crear un producto');
        }
    }


    //Actualizar productos en el archivo
    async actualizarProducto(id, product){
        try{         
            //Leer el archivo y obtenemos un objeto con los productos
            let products = await this.leerArchivo();
            const productIndex = products.findIndex(product => product.id ===id);
            products[productIndex] = {
                ...products[productIndex], 
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails
            };

          
            const todosLosProductos = [...products]
            await this.escribirArchivo(todosLosProductos)
            console.log('Producto actualizado exitosamente.');
            return (products[productIndex]);
        }catch(error){
            if (productIndex === -1){
                return console.error('Error al encontrar el producto');
            }
            
        }
        
    }

    //Eliminar producto en el archivo
    async eliminarProducto(id){
        try{         
            //Leer el archivo y obtenemos un objeto con los productos
            let products = await this.leerArchivo();
            const productIndex = products.findIndex(product => product.id === id);

            //Eliminar el producto del listado de productos
            products.splice(productIndex, 1);

            //Escribir el archivo
            const todosLosProductos = [...products]
        //Escribir el archivo
            await this.escribirArchivo(todosLosProductos)
            console.log('Producto eliminado exitosamente.');
        }catch(error){
            if (productIndex === -1){
                return console.error('Error al encontrar el producto');
            }
            
        }
        
    }
}

export default ProductManager;