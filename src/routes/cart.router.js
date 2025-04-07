import {Router} from 'express';
import { passportCall } from '../middlewares/passportCall.js';
import CartController from '../controllers/carts.controllers.js';

const router = Router();

const {createCart, getCarts, getCart, updateCart, deleteCart, deleteCarts}= new CartController

router.get('/', passportCall('jwt'), getCarts);
router.get('/cid', passportCall('jwt'), getCart);
router.post('/:cid', passportCall('jwt'), createCart)
router.put('/:cid/products/:pid', passportCall('jwt'), updateCart);
router.delete('/:cid/products/:pid', passportCall('jwt'), deleteCart)
router.delete('/:cid', passportCall('jwt'), deleteCarts)

export default router
