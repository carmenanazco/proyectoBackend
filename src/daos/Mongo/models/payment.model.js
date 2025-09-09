import { model, Schema } from "mongoose";
const paymentCollection = "payments" ;

const paymentSchema = new Schema({
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "failed"], default: "pending" },
    transactionId: { type: String }, // ID generado por Mercado Pago
    paymentDetails: { type: Object }, // Información completa de Mercado Pago
    createdAt: { type: Date, default: Date.now },
});

export const paymentModel= model(paymentCollection, paymentSchema);
