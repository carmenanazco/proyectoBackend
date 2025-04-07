import express from 'express';
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import __dirname from './utils.js'
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js'
import buscarRouter from './routes/buscar.router.js'
import sessionsRouter from './routes/api/sessions.router.js'
import userRouter from './routes/api/users.router.js'
import { conectDB, configObject } from './config/index.js'
import { initializePassport } from'./config/passport.config.js';
import passport from 'passport'
import cors from 'cors'
import nodemailer from 'nodemailer'

const exphbs = handlebars
const app = express();
const PORT = configObject.port

//nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: configObject.user,
        pass: configObject.pass
    },
    tls:{
        rejectUnauthorized:false
    }
})







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
app.use(cors())

app.engine('handlebars', handlebars.engine());
app.engine("handlebars", hbs.engine);

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'));

initializePassport()
app.use(passport.initialize())

conectDB()

app.use('/', viewsRouter)
app.use('/product', productRouter);
app.use('/buscar', buscarRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', userRouter)


app.post('/mail', async (req, res)=>{
    try {
        console.log(req.body);

        const { email } = req.body;
        
        const result = await transporter.sendMail({
            from: `Correo de prueba <${configObject.user}>`,
            to: email,
            subject: "Imagen enviada",
            html: `<div>
            <h1>Imagen enviada</h1>
            <p>Gracias por utilizar nuestro servicio</p>
            ${email}
            </div>`,
            attachments:[
                {
                    filename:"inicial.jpg",
                    path: "./src/public/img/inicial.jpg",
                    cid: "inicial",
                },
            ],
        });
        res.status(200).send("Correo enviado exitosamente")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error al enviar correo"+ error.message)
    }
})



app.listen(PORT, ()=>{
    console.log(`escuchando server en puerto ${PORT}`)    
});