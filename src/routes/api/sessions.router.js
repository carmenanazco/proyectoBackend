import { Router } from 'express';
import { passportCall } from '../../middlewares/passportCall.js'
import { authorization } from '../../middlewares/authorization.middleware.js'
import SessionsController from '../../controllers/sessions.controllers.js';
import passport from 'passport';


const router = Router()
const {register, login, callback, logout, current, perfil} = new SessionsController()

router.post('/register', register)
router.post('/login', login)


// Iniciar login con Google (scope email y perfil)
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

// Callback después del login exitoso
router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5501/pages/login.html?error=google', session: false }), callback);

router.get('/logout', logout)
router.get('/current', passportCall('jwt'), current)

router.get('/perfil', perfil)

export default router;