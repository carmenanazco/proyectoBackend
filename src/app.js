import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


const server = app.listen(8080, ()=>{
    console.log("El servidor se encuentra escuchando en el puerto 8080");
});



