import { ticketModel } from "../daos/Mongo/models/ticket.model.js";
import { cartService, ticketService, usersService } from "../services/index.js";

class TicketController{
    constructor(){
        this.service = ticketService
        this.serviceUser=usersService
        this.serviceCart=cartService
    }

    createTicket = async(req, res, next)=>{
        try {
            const {paymentDetails} = req.body;
            const userLog = await this.serviceUser.getUser({_id: req.user.id});
            let cartItems = await this.serviceCart.getCarts({_id: userLog.carts})
            const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
            /**
     * const { userEmail, cartItems, paymentInfo } = req.body;
    const order = await this.orderService.createOrder(userEmail, cartItems, paymentInfo);
    res.status(201).json(order);

             */
            const newTicket ={
                purchaser: userLog.email,
                items: cartItems,
                amount: total,
                status: "paid",
                paymentDetails,
            }
            const result = await this.service.createTicket(newTicket)
            res.status(201).json(result);
        } catch (error) {
            //return res.render('error', {error: "Error al finalizar compra el producto"});
            res.status(500).json({ error: "Error al crear el pedido" });
            }
    }

    getTickets= async (req, res)=>{
        try{
            const tickets = await this.service.getTickets({email: req.user.email})
            //res.json(ticketsbyUser);

            res.render('tickets', {tickets})
            //return ticketsbyUser
        }catch(error){
            res.status(500).json({error: "Error al obtener los pedidos"})
            //return res.render('error', {error:"Error al mostrar los tickets"});
        }
    }

    getTicket = async (req, res, next)=>{
        try{            
console.log(req.params);

           // const ticket = await this.service.getTicket({_id: req.params.tid});
    const ticket = await ticketModel.findById({_id: req.params.tid}).populate('products.productId').lean();
                                    console.log(ticket);

            if (!ticket) return res.status(404).json({ error: "Pedido no encontrado" });
          //if(!ticket) return res.render('error', {error: "Ticket no encontrado"});
            res.json({ticket});
            //return ticket
        }catch(error){    
            //return res.render('error', {error:"Error al obtener el ticket solicitado"});
            res.status(500).json({ error: "Error al obtener el pedido" });
            }
    }

    updateTicket = async(req, res)=>{
        try {
            const {status, paymentDetails} = req.body
            const ticketUpdated = await this.service.updateTicket({_id:req.params.tid}, { status, paymentDetails });
            //const order = await this.orderService.updateOrder(req.params.orderId, req.body);
            res.json(ticketUpdated);
        } catch (error) {
            //return res.render('error', {error:"Error al modificar el ticket"});
            res.status(500).json({ error: "Error al actualizar el pedido" });
        }
    }
}

export default TicketController
