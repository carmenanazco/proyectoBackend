import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import { Server } from 'socket.io';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js'
import ProductManager  from './fileManager/productManager.js';

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/products', viewsRouter)


const httpServer = app.listen(8080, ()=>{
    console.log(`El servidor se encuentra escuchando en el puerto 8080`);
});

const productManager = new ProductManager();

const socketServer = new Server(httpServer);
const products=await productManager.leerProductos()


socketServer.on('connection', (socket) =>{   

    socket.emit('loadProduct', products);
    socket.on('newProduct', async(product)=>{
        const newProduct = product
        await productManager.crearProducto(newProduct)
        socketServer.emit('nuevoProducto', newProduct);
    })  
})


