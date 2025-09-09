import { ticketModel } from "./models/ticket.model.js";


class TicketDaoMongo{
    constructor(){
        this.model = ticketModel
    }

    create = async newTicket => await this.model.create(newTicket)
    get = async(email)=> await this.model.find({ user: email }).populate('products.product');
    getBy = async filterObject => await this.model.findOne(filterObject)
    update = async (tid, ticketUpdate) => await this.model.findByIdAndUpdate({_id: tid}, ticketUpdate, {new: true})
    delete = async tid => await this.model.findByIdAndDelete({_id: tid}) 
}

export default TicketDaoMongo