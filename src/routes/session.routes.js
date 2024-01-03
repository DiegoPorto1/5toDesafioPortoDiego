import { Router } from "express";
import { login, logout } from "../controllers/session.controller.js";

const sessionRouter = Router();

sessionRouter.post('/login', login);
sessionRouter.get('/logout', logout);

export default sessionRouter;