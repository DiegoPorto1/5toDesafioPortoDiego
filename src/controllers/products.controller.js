import { productModel } from "../models/products.models.js";

const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next();
    } else {
        console.log('Acceso no autorizado. Rol actual:', req.session ? req.session.role : 'No hay sesión');
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
};

const getAllProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.query

    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1

    try {
        const prods = await productModel.paginate({ filter: filter }, { limit: lim, page: pag, sort: { price: ord } })
        if (prods) {
            return res.status(200).send(prods)
        }
        res.status(404).send({ error: "Productos no encontrados" })
    } catch (error) {
        res.status(500).send({ error: `Error en consultar productos ${error}` })
    }
}
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findById(id);
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: prod });
        else
            res.status(404).send({ respuesta: 'Error en consultar Producto', mensaje: 'Not Found' });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta producto', mensaje: error });
    }
};

const createProduct = async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category });
        res.status(200).send({ respuesta: 'OK', mensaje: prod });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear productos', mensaje: error });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, stock, status, code, price, category } = req.body;

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category }, { new: true });
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' });
        else
            res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'Not Found' });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar producto', mensaje: error });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findByIdAndDelete(id);
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' });
        else
            res.status(404).send({ respuesta: 'Error en eliminar Producto', mensaje: 'Not Found' });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar producto', mensaje: error });
    }
};

export { isAdmin, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };