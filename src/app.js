import express from 'express';
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import __dirname from './utils.js'
import { Server } from 'socket.io';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js'
import buscarRouter from './routes/buscar.router.js'
import ProductManager  from './fileManager/productManager.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import productModel from './models/product.model.js';
const exphbs = handlebars

dotenv.config();
const URIMongoDB = process.env.URIMONGO;

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));


const hbs = exphbs.create({
    helpers: {
        eq: (a, b) => a === b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        sum: (a, b) => a + b,
        subtract: (a, b) => a - b,
        includes: (array, value) => Array.isArray(array) && array.includes(value)
    }
});


app.engine("handlebars", hbs.engine);
const httpServer = app.listen(8080, ()=>{
    console.log(`El servidor se encuentra escuchando en el puerto 8080`);
});

const environmet= async() =>{
    await mongoose.connect(URIMongoDB)
    let products = await productModel.paginate(
       // {category: "figuras"},
        //{limit: 10, page: 1}
    )
    //console.log(products)
    // .then(()=> console.log("Conexion a base de datos exitosa"))
    // .catch((error)=> {
    //     console.error("Error en conexion: ", error)
    //     process.exit();
    // })
}

environmet();


app.use(methodOverride('_method'));

app.use('/api/carts', cartRouter);
app.use('/', viewsRouter)
app.use('/product', productRouter);
app.use('/buscar', buscarRouter);



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
    socket.on('deleteProduct', async(id) =>{
        await productManager.eliminarProducto(id)
        socket.emit('loadProduct', products);
    })
})


