import {Router} from 'express';
import { passportCall } from '../middlewares/passportCall.js';
import CartController from '../controllers/carts.controllers.js';

const router = Router();

const {createCart, getCarts, getCart, updateCart, deleteCart, deleteCarts, finalizarCompra}= new CartController

router.get('/', passportCall(), getCarts);
router.get('/:cid', passportCall(), getCart);
router.post('/', passportCall(), createCart)
router.put('/', passportCall(), updateCart);
router.delete('/:pid', passportCall(), deleteCart)
router.delete('/', passportCall(), deleteCarts)
router.post('/checkout', passportCall(), finalizarCompra)

export default router
