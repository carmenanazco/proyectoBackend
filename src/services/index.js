import {CartsDao, ProductsDao, UsersDao} from "../daos/factory.js";
import CartRepository from "./carts.repository.js";
import ProductRepository from "./products.repository.js";
import UserRepository from "./users.repository.js";

export const usersService = new UserRepository(new UsersDao())
export const productService = new ProductRepository(new ProductsDao())
export const CartService = new CartRepository(new CartsDao())

