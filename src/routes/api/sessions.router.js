import { Router } from 'express';
import { passportCall } from '../../middlewares/passportCall.js'
import { authorization } from '../../middlewares/authorization.middleware.js'
import SessionsController from '../../controllers/sessions.controllers.js';

const router = Router()
const {register, login, logout, current} = new SessionsController()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current', passportCall('jwt'), authorization('admin'), current)

export default router;