import nodemailer from 'nodemailer'
import { configObject } from '../config/index.js'
import pdfService from './pdfService.js';

//// Configurar transporte de correo
export const transporter = nodemailer.createTransport({
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


class EmailService {
    async sendOrderConfirmation(email, orderDetails) {
        const receiptPath = await pdfService.generateReceipt(orderDetails);
        const mailOptions = {
            from: 'Sempiterno3D <no-responder@ecommerce.com>',
            to: email,
            subject: "Confirmación de compra",
            html: `
            <h2>¡Gracias por tu compra!</h2>
            <p>Hemos recibido tu pedido y estamos procesándolo.</p>
            <h3>Detalles del pedido:</h3>
            <ul>
                ${orderDetails.map(item => `<li>${item.title} - ${item.quantity} x $${item.price}</li>`).join("")}
            </ul>
            <p>Total: $${orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
            <p>Puedes descargar tu recibo aquí: <a href="https://tu-ecommerce.com${receiptUrl}">Descargar recibo</a></p>
            <p>O escanea el QR adjunto para verificar tu pedido.</p>
            `,
            // attachments: [
            //     {
            //     filename: `receipt_${orderDetails._id}.pdf`,
            //     path: receiptPath,
            //     }
            // ]
        };
        await transporter.sendMail(mailOptions);
    }
}

export default new EmailService();

/*
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
})*/



/*
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
*/
