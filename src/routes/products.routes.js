import { Router } from "express";
import {passportError, authorization} from "../utils/messagesError.js"
import {  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import multer from "multer";

const productRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/images/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${file.originalname}`);
    },
  });
  
  const upload = multer({ storage: storage });

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/upload', passportError('jwt'),upload.array('thumbnails'), createProduct);
productRouter.put('/:id', passportError('jwt'), authorization('admin'), updateProduct);
productRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteProduct);

export default productRouter;