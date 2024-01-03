import { productModel } from "../models/products.models.js";

const isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
};

const getAllProducts = async (req, res) => {
    const { limit, page, category, sort } = req.query;

    try {
        let query = {};
        let link;
        if (category) {
            query.category = category;
            link = `&category=${query.category}`;
        }
        let options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sort || 1
        };

        const prods = await productModel.paginate(query, options);
        console.log(prods);

        const respuesta = {
            status: "success",
            payload: prods.docs,
            totalPages: prods.totalPages,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            page: prods.page,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevLink: prods.hasPrevPage ? null : null,
            nextLink: prods.hasNextPage ? null : null,
        };
        res.status(200).send(respuesta);
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar productos', mensaje: error });
    }
};

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
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category });
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