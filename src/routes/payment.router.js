import { Router } from 'express'; 
import PaymentController from '../controllers/payment.controller.js';

const router = Router();
const { processPayment, getPaymentStatus, webhook} = new PaymentController

router.post('/process', processPayment);
router.get('/paymentId', getPaymentStatus);

router.post("/webhook", webhook);


/*
 * - Ve a Panel de Mercado Pago.
- En la sección de Webhooks, agrega la URL de tu servidor donde recibirás los eventos, por ejemplo:
https://tu-dominio.com/api/payments/webhook
- Selecciona los eventos que quieres recibir, como payment o merchant_order.
 */

export default router;