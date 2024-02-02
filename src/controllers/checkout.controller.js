import { ticketModel } from "../models/ticket.models.js";
import { cartModel } from "../models/carts.models.js";
import { userModel } from "../models/user.models.js";
import { productModel } from "../models/products.models.js";

export const createTicket = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        const user = await userModel.findOne({ cart: cid });
        let purchaser = user.email;
        let amount = 0;
        let invalidProducts = [];
        let discountPremiumUsers = 0.1;
        console.log (purchaser)
        if (cart) {
            //FILTRAR PRODUCTOS QUE SUPEREN EL STOCK PARA AGREGARLOS A LA ORDEN DEL CHECKOUT
            const filteredProducts = await Promise.all(cart.products.map(async (prod) => {
                if (!prod.id_prod || !prod.id_prod._id) {
                    console.log("Producto no válido:", prod);
                    return null;
                }
                console.log("prod checkout controller", prod.id_prod._id);
                let product = await productModel.findById(prod.id_prod._id);
                console.log("stock checkout", product.stock)
                console.log("prod", prod)
                if (prod.quantity > product.stock) {
                    console.log("prod", prod)
		            console.log("product", product)
                    console.log("productos no suficientes")
                    //array para actualizar carrito
                    invalidProducts.push(prod);
                    return null
                } else {
                    console.log("prod", prod)
		            console.log("product", product)
                    const updatedStock = product.stock - prod.quantity;
                    await productModel.findByIdAndUpdate(product._id, { stock: updatedStock });
                    console.log("producto que va para orden", prod)
                    return prod;
                }
            }));

            // Filtra los productos que cumplen la condición y elimina los nulos
            const validProducts = filteredProducts.filter(Boolean);

            //ACTUALIZAR CARRITO PARA QUE QUEDE SOLO CON AQUELLOS PRODUCTOS CUYA CANTIDAD FUE SUPERIOR AL STOCK
            await cartModel.findByIdAndUpdate(cid, { products: invalidProducts })
            if (validProducts.length > 0) {
                validProducts.forEach(prod => {
                    if (user.rol === "premium") {
                        amount += (prod.quantity * prod.id_prod.price) * (1 - discountPremiumUsers);
                        console.log("usuario premium total", amount)
                    } else {
                        amount += prod.quantity * prod.id_prod.price;
                        console.log("usuario comun total", amount)
                    }
                })
                const ticket = await ticketModel.create({ amount, purchaser });
                console.log("ticket", ticket)
                if (ticket) {
                    res.status(200).send({ ticket })
                } else {
                    res.status(404).send({ error: "error al generar ticket. Alguno de los datos no son correctos" });
                }
            } else {
                res.status(404).send({ error: "No hay productos válidos en el carrito" });
            }
        } else {
            res.status(404).send({ "error al procesar carrito": error })
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ error: "Error en el servidor", details: error });
    }

}