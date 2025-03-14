import express from 'express';
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import __dirname from './utils.js'
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js'
import buscarRouter from './routes/buscar.router.js'
import sessionsRouter from './routes/sessions.router.js'
import { conectDB, configObject } from './config/index.js'
import { initializePassport } from'./config/passport.config.js';
import passport from 'passport'

//import dotenv from "dotenv";

const exphbs = handlebars
const app = express();
const PORT = configObject.port


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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(cookieParser())


app.engine('handlebars', handlebars.engine());
app.engine("handlebars", hbs.engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'));

initializePassport()
app.use(passport.initialize())

conectDB()

app.use('/api/carts', cartRouter);
app.use('/', viewsRouter)
app.use('/product', productRouter);
app.use('/buscar', buscarRouter);
app.use('/api/sessions', sessionsRouter)

app.listen(PORT, ()=>{
    console.log(`escuchando server en puerto ${PORT}`)    
});