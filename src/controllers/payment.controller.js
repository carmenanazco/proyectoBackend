import emailService from "../services/emailService.js";
import { paymentService, ticketService } from "../services/index.js";

import mercadopago from "mercadopago";

class PaymentController{
    constructor(){
        this.service= paymentService
    }

    processPayment = async(req, res) =>{
        try {
            const { orderId, userEmail, amount, transactionId, paymentDetails } = req.body;
            const payment = await this.paymentService.processPayment(orderId, userEmail, amount, transactionId, paymentDetails);
            res.status(201).json(payment);

        } catch (error) {
            res.status(500).json({ error: "Error al procesar el pago" });
        }
    }

    getPaymentStatus = async(req, res) =>{
        try {
            const payment = await this.paymentService.getPaymentStatus(req.params.paymentId);
            if (!payment) return res.status(404).json({ error: "Pago no encontrado" });
            res.json(payment);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener estado del pago" });
        }
    }

    webhook = async(req, res) => {
        try {
            const { type, data } = req.body;
            if (type === "payment") {
                const payment = await mercadopago.payment.findById(data.id);
                if (payment.status === "approved") {
                    const ticket = await ticketService.updateTicket(payment.external_reference, "paid", payment);
                    // Enviar correo de confirmación
                    await pdfService.generateReceipt(ticket);
                    await emailService.sendOrderConfirmation(ticket.purchaser, ticket);
                    console.log(`Pedido ${payment.external_reference} marcado como pagado.`);
                    console.log(`Confirmación enviada a ${ticket.purchaser}`);
                }
            }
            res.sendStatus(200);
        } catch (error) {
            console.error("Error en el Webhook:", error);
            res.status(500).json({ error: "Error interno" });
        }
    }
}

export default PaymentController;


/*
    createPaymentStripe =async (req, res) => {
        try {
            const { amount } = req.body;
            const clientSecret = await paymentService.createPaymentStripe(amount);
            res.json({ clientSecret });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createPaymentMP = async (req, res) => {
        try {
            const { items, email } = req.body;
            const paymentUrl = await paymentService.createPaymentMP(items, email);
            res.json({ paymentUrl });
            } catch (error) {
                res.status(500).json({ error: error.message });
        }
    }

    getPayment = async (req, res) => {
        try {
            const { type, data } = req.body;

            if (type === "payment") {
            const payment = await mercadopago.payment.findById(data.id);

            if (payment.status === "approved") {
                // Aquí puedes actualizar el estado del pedido en la base de datos
                await orderService.updateOrder(payment.order_id, { status: "paid" });
                console.log(`Pago aprobado: ${payment.id}`);
                }
            }

            res.status(200);
        } catch (error) {
            console.error("Error procesando el Webhook:", error);
            res.status(500).json({ error: "Error interno" });
        }
    }
}

export default PaymentController*/