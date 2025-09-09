import { Router } from "express";
import TicketController from "../controllers/tickets.controllers.js";
import { passportCall } from "../middlewares/passportCall.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router()
const {createTicket, getTickets, getTicket, updateTicket} = new TicketController

//router.get('/', getTickets)
router.get('/history', passportCall('jwt'), authorization('user'), getTickets);

router.get('/:tid', getTicket)
router.post('/', createTicket)
router.put('/:tid', updateTicket)
//router.delete('/:tid')

export default router


