import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messagesError.js";
import { login, logout, register } from "../controllers/session.controller.js";

const sessionRouter = Router();

sessionRouter.post('/login',passport.authenticate("login"), login);
sessionRouter.get('/logout', logout);
sessionRouter.post('/register',passport.authenticate("register"), register);
sessionRouter.get("/current", passportError("jwt"), authorization("user"), (req, res) => {res.send(req.user);});

export default sessionRouter;