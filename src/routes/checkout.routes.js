import { Router } from "express";
import { createTicket } from "../controllers/checkout.controller.js";

const checkoutRouter = Router();

checkoutRouter.post('/:cid', createTicket);

export default checkoutRouter;