class PaymentRepository{
    constructor(dao){
        this.dao = dao
    }

    createPayment = async newPayment=>await this.dao.create(newPayment)
    getPayments = async email => await this.dao.get(email)
    getPayment = async filter => await this.dao.getBy(filter)
    updatePayment = async(paymentId, status)=> await this.dao.update(paymentId, {status})
}

export default PaymentRepository





/*import Stripe from "stripe";
import mercadopago from "mercadopago"
import { configObject } from "../config/index.js";

const stripe = new Stripe(configObject.stripeSectretKey);
mercadopago.configure({
    access_token: configObject.mercadoPagoToken
});


class PaymentService {
    async createPaymentStripe(amount, currency = "usd") {
        const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe usa centavos
        currency,
        automatic_payment_methods: { enabled: true },
    });

    return paymentIntent.client_secret;
    }

    async createPaymentMP(items, payerEmail) {
        const preference = {
        items: items.map(item => ({
            title: item.title,
            unit_price: item.price,
            quantity: item.quantity,
            currency_id: "ARS"
        })),
        payer: { email: payerEmail },
        back_urls: {
            success: "http://localhost:3000/success",
            failure: "http://localhost:3000/failure",
            pending: "http://localhost:3000/pending"
        },
        auto_return: "approved"
    };
    const response = await mercadopago.preferences.create(preference);
    return response.body.init_point; // URL de pago
    }
}

export default new PaymentService();*/