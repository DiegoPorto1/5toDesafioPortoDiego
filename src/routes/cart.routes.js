import { Router } from "express";
import { passportError, authorization } from "../utils/messagesError.js";
import { cartController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get('/:cid', passportError('jwt'), authorization('user'), cartController.getCart);
cartRouter.post('/:cid/product/:pid', passportError('jwt'), authorization('user'), cartController.postCart);
cartRouter.put('/:cid', passportError('jwt'), authorization('user'), cartController.putProductToCart);
cartRouter.put('/:cid/product/:pid', passportError('jwt'), authorization('user'), cartController.putUpdatedQuantityProductToCart);
cartRouter.delete('/:cid/product/:pid', passportError('jwt'), authorization('user'), cartController.deleteProdCart);
cartRouter.delete('/:cid', passportError('jwt'), authorization('user'), cartController.deleteCart)

export default cartRouter;