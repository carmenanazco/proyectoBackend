import mongoose, { model, Schema } from "mongoose";
import { v4 as uuidv4} from "uuid";

const ticketCollection = "tickets" ;

const ticketSchema = new Schema({
    code: { //numero de pedido
        type: String, 
        unique: true,
        default: uuidv4,
        index: true
    },
    user: { 
        type: Schema.Types.ObjectId, ref: "User",
        required: true
    }, 
    products: [
        {
            // //productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            productId: {type: Schema.Types.ObjectId, ref: 'products'},
            subtotal: Number,
            quantity: Number,
        }
    ],
    total: Number,
    status: { type: String, enum: ["pending", "paid", "preparing", "shipped"], default: "pending" },
    paymentDetails: { type: Object }, // Guarda detalles del pago (Mercado Pago, Stripe)
    receiptUrl: String, // URL del recibo PDF con QR
    createdAt: { //Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
        type: Date,
        default: Date.now,
        index: true
    },
})

ticketSchema.pre('find', function(next){
    this.populate('products.product');
    next();
})



export const ticketModel = model(ticketCollection, ticketSchema)
