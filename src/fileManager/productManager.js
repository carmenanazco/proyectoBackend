import fs from 'fs';

class ProductManager {

    constructor(){
        this.filePath = './products.json';
    }

    //Almacenar producto en el archivo
    async crearProducto(product){
        try{         
            //Leer el archivo y obtenemos un objeto con los productos
            let products = await this.leerProductos();
            //Agregar el producto al listado de productos
            products.push(product);
            //Escribir el archivo
            await fs.writeFile(this.filePath, JSON.stringify(products,null,2));
            console.log('Producto creado exitosamente.');
        }catch(error){
            console.error('Error al crear un producto');
        }
        
    }

    async leerProductos(){
        try{
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            console.log(data)
            return JSON.parse(data) || [];
        }catch(error){
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error('Error al leer productos:', error);
                throw error; 
            }
        }
    }

    async leerUnProducto(id){
        try{
            let products = await this.leerProductos();
            const product = products.find(product => product.id === id)
            return product;

        }catch(error){
            if (!product) {
                return console.error('Producto no encontrado:', error);
        }
    }
    }


        //Actualizar productos en el archivo
        async actualizarProducto(id, product){
            try{         
                //Leer el archivo y obtenemos un objeto con los productos
                let products = await this.leerProductos();
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

                //Escribir el archivo
                await fs.writeFile(this.filePath, JSON.stringify(products,null,2));
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
            let products = await this.leerProductos();
            const productIndex = products.findIndex(product => product.id === id);

            //Eliminar el producto del listado de productos
            products.splice(productIndex, 1);

            //Escribir el archivo
            await fs.writeFile(this.filePath, JSON.stringify(products,null,2));
            console.log('Producto eliminado exitosamente.');
        }catch(error){
            if (productIndex === -1){
                return console.error('Error al encontrar el producto');
            }
            
        }
        
    }



}

export default ProductManager;