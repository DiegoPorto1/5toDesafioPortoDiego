import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { ticketModel } from "../models/ticket.models.js";

const isUser = (req, res, next) => {
    if (req.session && req.session.role === 'user') {
        return next();
    } else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
};

const getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid);
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart });
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error });
    }
};

const createCart = async (req, res) => {
    try {
        const cart = await cartModel.create({});
        res.status(200).send({ respuesta: 'OK', mensaje: cart });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error });
    }
};

export { isUser, getCartById, createCart };