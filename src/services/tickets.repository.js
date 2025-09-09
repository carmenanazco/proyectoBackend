class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    createTicket = async newTicket=>await this.dao.create(newTicket)
    getTickets = async email => await this.dao.get(email)
    getTicket = async filter => await this.dao.getBy(filter)
    updateTicket = async(tid, status)=> await this.dao.update(tid, {status})
    deleteTicket = async tid => await this.dao.delete(tid)
}

export default TicketRepository