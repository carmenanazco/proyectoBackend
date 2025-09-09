import express from 'express';
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import __dirname from './utils.js'
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js'
import enviosRouter from './routes/api/envios.router.js'
import ticketRouter from './routes/ticket.router.js'
import sessionsRouter from './routes/api/sessions.router.js'
import userRouter from './routes/api/users.router.js'
import paymentRoutes from './routes/payment.router.js'
import { conectDB, configObject } from './config/index.js'
import { initializePassport } from'./config/passport.config.js';
import passport from 'passport'
import cors from 'cors'
import path from "path";
import { passportCall } from './middlewares/passportCall.js';

const exphbs = handlebars
const app = express();
const PORT = configObject.port
app.use(cookieParser())


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
app.use(cors({
    origin: "http://localhost:5501", // 🔹 URL específica del frontend
    credentials: true,             // 🔹 Permitir envío de cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(express.static("public")); 



app.engine('handlebars', handlebars.engine());
app.engine("handlebars", hbs.engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'));


initializePassport()
app.use(passport.initialize())


conectDB()

app.use('/', viewsRouter)
app.use('/api/products', productRouter);
app.use('/api/envios', passportCall('jwt'),enviosRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', userRouter)
app.use('/api/payments', paymentRoutes)
app.use("/receipts", express.static(path.join(__dirname, "public/receipts")));



app.listen(PORT, ()=>{
    console.log(`escuchando server en puerto ${PORT}`)    
});