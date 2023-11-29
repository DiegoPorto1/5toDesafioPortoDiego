import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { ticketModel } from "../models/ticket.models.js";

const cartRouter = Router()


const isUser = (req, res, next) => {
    // Verificar si el usuario es un usuario normal
    if (req.session && req.session.role === 'user') {
      return next();
    } else {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
  };


cartRouter.get('/:cid', isUser, async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await cartModel.findById(cid)
        if (cart)
            res.status(200).send({ respuesta: 'OK', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
})

cartRouter.post('/',isUser, async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'OK', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
});

cartRouter.post('/:cid/products/:pid',isUser, async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid) 

            if (prod) {
                const indice = cart.products.products.findIndex(item => item.id_prod_id.toString() == pid) 
                if (indice != -1) {
                    cart.products.products[indice].quantity = quantity 
                } else {
                    cart.products.products.push({ id_prod: pid, quantity: quantity }) 
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart) 
                res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Produt Not Found' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart Not Found' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
})
cartRouter.delete('/:cid',isUser, async (req, res) => {
    const { cid } = req.params
    try {
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        res.status(200).send({ respuesta: 'ok', mensaje: 'Carrito vacio' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error getting cart by id', mensaje: error })
    }
})

cartRouter.delete('/:cid/products/:pid',isUser, async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid)
                if (indice !== -1) {
                    cart.products.splice(indice, 1)
                }
            }
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error getting cart by id', mensaje: error })
    }
})

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const productsArray = req.body.products

    if (!Array.isArray(productsArray)) {
        return res.status(400).send({ respuesta: 'Error', mensaje: 'Products should be an array' })
    }

    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            throw new Error("Cart not found")
        }
        for (let prod of productsArray) {
            const indice = cart.products.findIndex(cartProduct => cartProduct.id_prod.toString() === prod.id_prod)

            if (indice !== -1) {
                cart.products[indice].quantity = prod.quantity
            } else {
                const existe = await productModel.findById(prod.id_prod)
                if (!existe) {
                    throw new Error(`Product with ID ${prod.id_prod} not found`)
                }
                cart.products.push(prod)
            }
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message })
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === pid)
                if (index !== -1) {
                    cart.products[index].quantity = quantity
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity })
                }
            }
        }

        res.status(200).send({ respuesta: 'OK', mensaje: 'Cart Updated' })
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message })
    }
})





cartRouter.post('/:cid/purchase', isUser, async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).send({ respuesta: 'Error en finalizar compra', mensaje: 'Carrito no encontrado' });
        }

        if (cart.products.length === 0) {
            return res.status(400).send({ respuesta: 'Error en finalizar compra', mensaje: 'El carrito está vacío' });
        }

        const promises = cart.products.map(async (item) => {
            const product = await productModel.findById(item.id_prod);

            if (!product) {
                return res.status(404).send({
                    respuesta: 'Error en finalizar compra',
                    mensaje: `Producto con ID ${item.id_prod} no encontrado`
                });
            }

            
            if (product.stock >= item.quantity) {
                
                product.stock -= item.quantity;
                await product.save();
            } else {
                return res.status(400).send({
                    respuesta: 'Error en finalizar compra',
                    mensaje: `No hay suficiente stock para el producto con ID ${item.id_prod}`
                });
            }
        });

        
        await Promise.all(promises);

        
        await cartModel.findByIdAndUpdate(cid, { products: [] });

       
        const ticketData = {
            user: req.session.userId,
            products: cart.products,
            
        };

        try {
            const newTicket = await ticketModel.create(ticketData);
            res.status(200).send({
                respuesta: 'OK',
                mensaje: 'Compra realizada con éxito',
                ticketId: newTicket._id,  
            });
        } catch (error) {
            
            console.error("Error al crear el ticket:", error);
            res.status(500).send({ respuesta: 'Error', mensaje: 'Error al procesar la compra' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en finalizar compra', mensaje: error.message });
    }
});





export default cartRouter