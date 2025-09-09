import {CartsDao, ProductsDao, UsersDao} from "../daos/factory.js";
import PaymentDao from "../daos/Mongo/payments.dao.js";
import TicketDaoMongo from "../daos/Mongo/tickets.dao.js";

import CartRepository from "./carts.repository.js";
import PaymentRepository from "./payment.repository.js";
import ProductRepository from "./products.repository.js";
import TicketRepository from "./tickets.repository.js";
import UserRepository from "./users.repository.js";

export const usersService = new UserRepository(new UsersDao())
export const productService = new ProductRepository(new ProductsDao())
export const cartService = new CartRepository(new CartsDao())
export const ticketService = new TicketRepository(new TicketDaoMongo())
export const paymentService = new PaymentRepository(new PaymentDao())
