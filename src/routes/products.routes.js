import { Router } from "express";
import {passportError, authorization} from "../utils/messagesError.js"
import {  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";


const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', passportError('jwt'), authorization('admin'), createProduct);
productRouter.put('/:id', passportError('jwt'), authorization('admin'), updateProduct);
productRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteProduct);

export default productRouter;