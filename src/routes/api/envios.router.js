import { Router} from "express";
import { userModel } from "../../daos/Mongo/models/users.model.js";
import { cartModel } from "../../daos/Mongo/models/cart.model.js";

const router = Router()

router.get('/', (req, res) => {
    const cp = req.query.cp;

    if (!cp || cp.length < 4) {
        return res.status(400).json({ error: "Código postal inválido" });
    }

  // Lógica simulada: costo por zona
    let precio = 0;

    if (cp.startsWith("14")) precio = 100; // CABA
    else if (cp.startsWith("16") || cp.startsWith("17")) precio = 120; // Buenos Aires
    else if (cp.startsWith("5")) precio = 180; // Córdoba
    else precio = 200; // Resto del país

    res.json({ precio });
});

router.post('/', async (req, res) => {
    const { cp } = req.body;
    console.log(req.user);
    
    if (!cp || cp.length < 4) {
        return res.status(400).json({ error: "Código postal inválido" });
    }

    let precio = 0;

    if (cp.startsWith("14")) precio = 100;
    else if (cp.startsWith("16") || cp.startsWith("17")) precio = 120;
    else if (cp.startsWith("5")) precio = 180;
    else precio = 200;

    try {
        const user = await userModel.findById(req.user.id);
        const cart = await cartModel.findById(user.carts);

        cart.shipping = precio;
        cart.codigoPostal=cp;
        await cart.save();

        res.json({ precio, cp });
    } catch (err) {
        res.status(500).json({ error: "No se pudo guardar el envío" });
    }
});


export default router