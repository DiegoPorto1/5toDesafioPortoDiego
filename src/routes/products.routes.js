import { Router } from "express";
import { isAdmin, getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";


const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', isAdmin, createProduct);
productRouter.put('/:id', isAdmin, updateProduct);
productRouter.delete('/:id', isAdmin, deleteProduct);

export default productRouter;